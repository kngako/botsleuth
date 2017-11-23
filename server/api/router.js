/**
 * This router handles things related to the web api requests...
 */
module.exports = function (options) {
    var express = options.express;
    var config = options.config;

    var router = express.Router();

    router.get('/be-humble', function(request, response) {
        response.json({ message: 'sit-down' });   
    });

    router.get('/resend-confirmation', function(request, response) {
        if(request.user) {
            // TODO: Resend confirmation email...
            if(request.user.emailConfirmedOn != null) {
                response.status(500).send("You are already confirmed.");
            } else {
                db.Confirmation.findOne({
                    where: {
                        userId: request.user.id
                    },
                    include: [
                        {
                            model: db.User,
                            attributes: ['id', 'email', 'firstName', 'lastName']
                        }
                    ]
                }).then(confirmation => {
                    if(confirmation) {
                        if(confirmation.sent > config.get("email.maxConfirmationEmails")) {
                            response.status(500).send("We have sent all the confirmation emails we could :(");
                        } else {

                            email.sendConfirmationEmail(
                                confirmation.user.firstName, 
                                confirmation.token, 
                                confirmation.user.email, 
                                function (info) {
                                    // Confirmation email sent successfully...
                                    return confirmation.increment({
                                        'sent': 1
                                    })
                                }, function(error){
                                    console.error("Failed to resend confirmation: " + error);
                                    // TODO: Log errors...
                                    //response.status(500).send("Having technical difficulities.");
                                } );

                            response.json({ message: 'Confirmation will be resent... check email.' });   
                                
                        }
                    } else {
                        response.status(500).send("Please re-register with a different email because korruption...");
                    }
                })
            }
            
        } else {
            response.status(401).send("You don't have the cred to be in these streets.");
        }
        
    });

    router.use(function (request, response, next) {
        // TODO: Check the accept...
        response.status(500).json({
            message: "Server error..."
        });
    })

    return router;
};