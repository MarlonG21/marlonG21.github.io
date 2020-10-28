// set the focus to the input box
document.getElementById("wisdom").focus();

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
// Provide your Pool Id here
    IdentityPoolId: 'us-east-1:7fc9df5a-742b-43c2-a359-829b54edf2c4',
});
AWS.config.correctClockSkew = true;
var lexruntime = new AWS.LexRuntime();
var lexUserId = 'firstChatbot' + Date.now();
var sessionAttributes = {};


function pushChat() {

    // if there is text to be sent...
    var wisdomText = document.getElementById('wisdom');
    if (wisdomText && wisdomText.value && wisdomText.value.trim().length > 0) {

        // disable input to show we're sending it
        var wisdom = wisdomText.value.trim();
        wisdomText.value = '...';
        wisdomText.locked = true;

        // send it to the Lex runtime
        var params = {
            botAlias: 'test_bot',
            botName: 'firstChatbot',
            inputText: wisdom,
            userId: lexUserId,
            sessionAttributes: sessionAttributes
        };
        showRequest(wisdom);
        lexruntime.postText(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                showError('Error:  ' + err.message + ' (see console for details)');
            }
            if (data) {
                console.log(data);
                // capture the sessionAttributes for the next cycle
                sessionAttributes = data.sessionAttributes;
                // show response and/or error/dialog status
                showResponse(data);
                showCard(data);
            }
            // re-enable input
            wisdomText.value = '';
            wisdomText.locked = false;
        });
    }
    // we always cancel form submission
    return false;
}

function showRequest(daText) {

    var conversationDiv = document.getElementById('conversation');
    var requestPara = document.createElement("P");
    requestPara.className = 'userRequest';
    requestPara.appendChild(document.createTextNode(daText));
    conversationDiv.appendChild(requestPara);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function showError(daText) {

    var conversationDiv = document.getElementById('conversation');
    var errorPara = document.createElement("P");
    errorPara.className = 'lexError';
    errorPara.appendChild(document.createTextNode(daText));
    conversationDiv.appendChild(errorPara);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function showResponse(lexResponse) {

    var conversationDiv = document.getElementById('conversation');
    var responsePara = document.createElement("P");
    responsePara.className = 'lexResponse';
    if (lexResponse.message) {
        responsePara.appendChild(document.createTextNode(lexResponse.message));
        responsePara.appendChild(document.createElement('br'));
    }
    if (lexResponse.dialogState === 'ReadyForFulfillment') {
        responsePara.appendChild(document.createTextNode(
            'Ready for fulfillment'));
        // TODO:  show slot values
    } else {
        // responsePara.appendChild(document.createTextNode(
        //     '(' + lexResponse.dialogState + ')'));
    }
    conversationDiv.appendChild(responsePara);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
}


function showCard(lexCardResponse){
    var conversationDiv = document.getElementById('conversation');
    var card_image = document.createElement('DIV');
    var response_card = document.createElement('DIV');
    
    card_image.className = 'card_image';
    if(lexCardResponse.responseCard)
    {
        response_card.className = "card_container";
        response_card.style.height = "100%";
        response_card.style.width = "95%";
        // response_card.style.backgroundColor = "gray";
        var link = lexCardResponse.responseCard.genericAttachments[0].imageUrl;
        card_image.style.background = "url("+link+")";
        card_image.style.backgroundSize = "cover";
        card_image.style.height = "50%";
        card_image.style.width = "50%";
        // console.log(typeof(lexCardResponse.responseCard.genericAttachments[0].imageUrl));
    }
    response_card.appendChild(card_image);
    conversationDiv.appendChild(response_card);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
}