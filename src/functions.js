import {notifications, loadingIsActive} from "./stores"
import fetch from "node-fetch";
import { goto } from '@sapper/app'

/**
 * Validate if `userPermissions` contains all `permissionsRequired`
 *
 * @param {number[]} permissions_ids - List of `permission_id` to be validated
 * @param {number[]} userPermissions - List of `permission_id` the user has
 *
 * @return {boolean}
 */
export const checkPermissions = (permissions_ids, userPermissions) => {
    return permissions_ids.every(permission_id => {  // All *permissions_ids* must pass validation
        return userPermissions.includes(permission_id);
    })
}

/**
 * currency_code should not be received from frontend, is a vulnerability
 * se debe hacer previamente un query para obtener la moneda de la ODT
 */
// export async function getRate(counter_currency_code, base_currency_code){
//     if (counter_currency_code === base_currency_code) {
//         return 1;
//     }
//     const url = `https://bolivarparalelo.com/api/rate/${counter_currency_code}/${base_currency_code}`;
//     const response = await fetch(url);
//     const rates = await response.json();
//     const rate = (rates.buy + rates.sell) / 2;
//     console.log({url});
//     return rate;
// }

/**
 * @param {string} msg message to notify
 */
export function notify(title, kind="error", subtitle="", caption=undefined) {

    const newNotification = {title, subtitle, kind, caption};
    let newIndex;

    notifications.update(notificationsQueue => {
        newIndex = notificationsQueue.length;
        return [...notificationsQueue, newNotification]
    })
    setTimeout(() => {
        notifications.update(notificationsQueue => {
            delete notificationsQueue[newIndex];
            return (notificationsQueue.filter(x=>x).length > 0) // checking if there is any notification active
                ? notificationsQueue
                : []
        })
    }, 5000);
}

export function next_date(deadline, term, days_to_repeat){
    const terms_in_unix = {
        day: 86400000,
        week: 86400000 * 7,
        every_x_days: 86400000 * days_to_repeat
    };
    let current_date = new Date(new Date().toLocaleDateString());
    switch (term) {
        case "daily": //This event will happen each day starting in deadline
            if(new Date(deadline) > current_date){
                return new Date(deadline);
            }else{
                return new Date(new Date (+new Date (deadline) + terms_in_unix.day).toLocaleDateString());
            }
        case "weekly": //This event will happen each week at the day selected in deadline
            if(new Date(deadline) > current_date){
                return new Date(deadline);
            }else{
                return new Date(new Date (+new Date (deadline) + terms_in_unix.week).toLocaleDateString());
            }
        case "biweekly": //This event will happen each 15th and last day of each month *DOES NOT start at deadline*
            let new_deadline = new Date(new Date(deadline).toLocaleDateString());
            let current_month = new_deadline.getMonth();
            let current_year = new_deadline.getFullYear();
            if(new_deadline <= new Date(current_year, current_month, 15)){
                return new Date(current_year, current_month, 15);
            }else if(new_deadline > new Date(current_year, current_month, 15) && new_deadline <= new Date(current_year, current_month+1, 0)){
                return new Date(current_year, current_month+1, 0);
            }
        case "monthly": //This event will happen each month at the day selected in deadline
            if(new Date(deadline) > current_date){
                return new Date(deadline);
            }else{
                let day = new Date(deadline).getDate();
                let month = new Date(deadline).getMonth();
                let year = new Date(deadline).getFullYear();
                return new Date(year, month+1, day);
            }
        case "bimonthly": //This event will happen each two months at the day selected in deadline
            if(new Date(deadline) > current_date){
                return new Date(deadline);
            }else{
                let day = new Date(deadline).getDate();
                let month = new Date(deadline).getMonth();
                let year = new Date(deadline).getFullYear();
                return new Date(year, month+2, day);
            }
        case "quarterly": //This event will happen each three months at the day selected in deadline
            if(new Date(deadline) > current_date){
                return new Date(deadline);
            }else{
                let day = new Date(deadline).getDate();
                let month = new Date(deadline).getMonth();
                let year = new Date(deadline).getFullYear();
                return new Date(year, month+3, day);
            }
        case "biannual": //This event will happen each six months at the day selected in deadline
            if(new Date(deadline) > current_date){
                return new Date(deadline);
            }else{
                let day = new Date(deadline).getDate();
                let month = new Date(deadline).getMonth();
                let year = new Date(deadline).getFullYear();
                return new Date(year, month+6, day);
            }
        case "yearly": //This event will happen each year at the day selected in deadline
            if(new Date(deadline) > current_date){
                return new Date(deadline);
            }else{
                let day = new Date(deadline).getDate();
                let month = new Date(deadline).getMonth();
                let year = new Date(deadline).getFullYear();
                return new Date(year+1, month, day);
            }
        case "every x days": //This event will happen each X days starting in deadline
            if(new Date(deadline) > current_date){
                return new Date(deadline);
            }else{
                return new Date(new Date (+new Date (deadline) + terms_in_unix.every_x_days).toLocaleDateString());
            }
    }
}

export async function apiFetch (url, options={}) {
    loadingIsActive.set(true);

    let response, data, error, success, warning, redirect;
    try {
        response = await fetch(url, options);
    } catch (err) {
        notify("Error de red", "error", err.message);
        loadingIsActive.set(false);
        throw err;
    }
    loadingIsActive.set(false);
    if (response.status >= 500) {
        notify(response.status, "error", response.statusText)
    }
    {
        let body;
        try {
            body = await response.text();
            ({error, success, warning, redirect, ...data} = JSON.parse(body));
        } catch (err) {
            notify(err.message, "error", body, true);
            throw err;
        }
    }

    if (success) notify(success, "success");
    if (warning) notify(warning, "warning");
    if (redirect) goto(redirect);
    if (error) {
        notify(error);
        throw new Error(error);
    }

    return data;
}

export const api = {
    get: apiFetch,
     post: async (url, bodyObject, headers={}, options={}) =>
        await apiFetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', ...headers},
            body: JSON.stringify(bodyObject),
            ...options
        }),
    patch: async (url, bodyObject, headers={}, options={}) =>
        await apiFetch(url, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json', ...headers},
            body: JSON.stringify(bodyObject),
            ...options
        }),
    delete: (url, options={}) => apiFetch(url, {method: 'DELETE', ...options})
}

/**
 * Examples
 * 
 * GET: `const users = await api.get('api/users')`
 * POST: `await api.post('api/users', newUser)`
 * PATCH: `await api.patch('api/user/123', modifiedUser)`
 * DELETE: `await api.delete('api/user')`
 */
