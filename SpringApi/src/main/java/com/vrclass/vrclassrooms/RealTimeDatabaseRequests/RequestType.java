package com.vrclass.vrclassrooms.RealTimeDatabaseRequests;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

public class RequestType {

enum REQUEST{
    COURSEDETAIL,
    TEACHER, HOME
}
private final REQUEST request;
private String uuid;
private final String idToken;

    public RequestType(String requestType, String idToken) {
        this.request = REQUEST.valueOf(requestType.toUpperCase());
        this.idToken=idToken;
    }
    public void VerifyToken() throws FirebaseAuthException {
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        this.uuid = decodedToken.getUid();
    }
    public String getUuid(){
        return uuid;
    }
    public REQUEST getRequest() {
        return request;
    }

    public String getIdToken() {
        return idToken;
    }
}

