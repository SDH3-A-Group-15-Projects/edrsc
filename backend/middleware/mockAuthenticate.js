const mockAuthenticate = (req, res, next) => {

    if (req.headers['x-test-uid'] && req.headers['x-test-email']) {
        req.user = {
            uid: req.headers['x-test-uid'],
            email: req.headers['x-test-email']
        };
        console.log("Mocking req.user:", req.user);
    } else {
        console.log("No x-test-uid/email headers found. req.user will not be mocked.");
    }
    next();
};

export default mockAuthenticate;