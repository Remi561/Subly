export async function register(req, res) {
    const {name} = req.body
    res.json({message: `This is the register route ${name}`})
}

export async function login(req, res) {
    const {name} = req.body
    res.json({message: `This is the login route ${name}`})
}