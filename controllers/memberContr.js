let memberController = module.exports;

memberController.home = (req, res) =>{
    console.log("GET controller.home")
    res.send("You are in Homepage")
};

memberController.signup = (req, res) =>{
    console.log("POST controller.signup")
    res.send("You are in signup-page")
};

memberController.login = (req, res) =>{
    console.log("POST controller.login")
    res.send("You are in login-page")
};

memberController.logout = (req, res) =>{
    console.log("GET controller.logout")
    res.send("You are in logout")
};