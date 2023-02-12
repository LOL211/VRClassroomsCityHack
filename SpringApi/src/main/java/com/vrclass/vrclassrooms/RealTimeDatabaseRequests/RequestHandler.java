package com.vrclass.vrclassrooms.RealTimeDatabaseRequests;
import com.google.firebase.auth.FirebaseAuth;
import com.vrclass.vrclassrooms.DatabaseRequests.DatabaseManager;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@CrossOrigin
public class RequestHandler {
    private final DatabaseManager database = DatabaseManager.getInst();

    @PostMapping("/token")
    public String getToken(@RequestBody RequestType rq)
    {
        try{
            rq.VerifyToken();

            if(rq.getRequest()!= RequestType.REQUEST.TEACHER)
                return "Not teacher";


            if(database.isTeacher(rq.getUuid()))
            {

                Map<String, Object> additionalClaims = new HashMap<>();
                additionalClaims.put("Teacher", true);

                String customToken = FirebaseAuth.getInstance()
                        .createCustomToken(rq.getUuid(), additionalClaims);
                System.out.println("Teacher found");
                return customToken;
            }
            else
            {
                String customToken = FirebaseAuth.getInstance()
                        .createCustomToken(rq.getUuid());
                System.out.println("Teacher not found, sending token");
                return customToken;
            }

        }
        catch(Exception e)
        {
            System.out.println("Error");
            return null;
        }
    }
    @PostMapping("/home/{classid}")
    public Boolean getCourseDetails(@RequestBody RequestType rq, @PathVariable("classid") String classid)
    {
        try{
            rq.VerifyToken();
        }
        catch(Exception e)
        {
            return false;
        }

        try{
            database.getCourse(classid);
        }
        catch(Exception e){
            return false;
        }
        try{
            System.out.println("Request is sucessful");
            return database.verifyClassmembership(rq.getUuid(), database.getCourse(classid)) && rq.getRequest() == RequestType.REQUEST.COURSEDETAIL;

        }catch (Exception e)
        {
            return false;
        }

    }


    @PostMapping("/home")
    public Map<String, String> getHomeDetails(@RequestBody RequestType rq){
        HashMap<String, String>map = new HashMap<>();
        try{
            rq.VerifyToken();
        }
        catch(Exception e)
        {
            map.put("Invalid Request", "Invalid auth");
            return map;
        }
        if(rq.getRequest()== RequestType.REQUEST.HOME){
            try {
                System.out.println("valid request");
                return database.getHomeDetails(rq);
            } catch (ExecutionException | InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
        else {

            map.put("Invalid Request", "Invalid Request type");
            return map;
        }
    }


}
