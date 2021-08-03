export default (req, res, next)=>{
    if (
        req.path.startsWith('/public') // These paths are exempt, continue
        || req.session.user // Everything else require login to continue
    ) return next()

    /**
     * Unauthorized
     * A not-logged-in user is requesting a protected endpoint
     */
    res.statusCode=401;
    res.json({
        warning: "Usuario debe iniciar sesión",
        redirect: "/login"
    })
}
