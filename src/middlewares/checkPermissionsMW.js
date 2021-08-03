import { checkPermissions } from "../functions";


/**
 * @param {[string, number][]} permissionsRequired
 * @param {{session: {user: {permissions: number[]}}}} req
 * @param {*} res
 * @param {*} next
 */
const checkPermissions_semiMW = async (permissionsRequired, req, res, next) => {
    const {permissions: userPermissions} = req.session.user;

    let permissions_names=[], permissions_ids=[];
    permissionsRequired.forEach( permission => {
        const [name, id] = permission;
        permissions_names.push(name);
        permissions_ids.push(id);
    })

    const isAuthorized = checkPermissions(permissions_ids, userPermissions);
    if (isAuthorized) return next();

    res.statusCode=403;
    res.json({
        error: `No está autorizado para realizar esta acción.\n Necesita los siguientes permisos: ${permissions_names.join(', ')}`,
    })
}

/**
 * Pass as arguments all permissions you need to validate
 *
 * @param  {...(string | number)[]} permissionsRequired - List of `permission_id` to be validated
 *
 * @return {import("polka").Middleware}
 */
function checkPermissionsMW (...permissionsRequired) {
    // @ts-ignore
    return (req, res, next) => checkPermissions_semiMW(permissionsRequired, req, res, next);
}

export default checkPermissionsMW;


/**
 * Los menús y permisos ahora se declaran en el archivo `/contatrib-erp/utils/checkPermissions.js`
 *
 * **utils** es un módulo donde se pondrán todas las funciones y clases que se usen en el **back** y en el **front**,
 * ya que es accesible desde ambos.
 */