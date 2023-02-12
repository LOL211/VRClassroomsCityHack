package com.vrclass.vrclassrooms.DatabaseRequests;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.*;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.gson.Gson;
import com.vrclass.vrclassrooms.DataTypes.Course;
import com.vrclass.vrclassrooms.RealTimeDatabaseRequests.RequestType;

import org.jetbrains.annotations.NotNull;


import java.io.FileInputStream;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@SuppressWarnings("SpellCheckingInspection")
public class DatabaseManager {
    private final Firestore db;
    static private final DatabaseManager inst;

    static {
        try {
            inst = new DatabaseManager();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    static public DatabaseManager getInst(){
        return inst;
    }
    private DatabaseManager() throws IOException {
        FileInputStream serviceAccount =
                new FileInputStream("src/main/resources/firebase_config.json");
        GoogleCredentials cred = GoogleCredentials.fromStream(serviceAccount);
        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(cred)
                .setDatabaseUrl("https://vr-application-29195-default-rtdb.firebaseio.com/")
                .build();

        FirebaseApp.initializeApp(options);
        db = FirestoreClient.getFirestore();
    }


    public Course getCourse(String id) throws ExecutionException, InterruptedException {

        DocumentSnapshot q = db.collection("Courses").document(id).get().get();

        List<String> studentuuid = null;
        try {
            studentuuid = (List<String>) q.get("student_uuid");
        }
        catch
        (Exception e)
        {

        }

        return new Course(studentuuid, (String) q.get("teacher_uuid"), id);
    }

    public List<Course> getAllCourses() throws ExecutionException, InterruptedException {
        QuerySnapshot q = db.collection("Courses").get().get();

       List<QueryDocumentSnapshot> docs = q.getDocuments();
        List<Course> results = new ArrayList<>();

        for(QueryDocumentSnapshot d: docs)
       {
          String coursename = d.getId();
          List<String> studentuuid = null;
          try{
            studentuuid = (List<String>) d.get("student_uuid");
          }
           catch(Exception e){

       }
           String teacheruuid = (String) d.get("teacher_uuid");

          results.add(new Course(studentuuid, teacheruuid, coursename));

       }

        return results;
    }

    public Boolean verifyClassmembership(String uuid, Course course) throws ExecutionException, InterruptedException {
        DocumentSnapshot q = db.collection("users").document(uuid).get().get();
        String role = (String) q.get("role");


        if(role.equals("Teacher"))
        {
            List<Course> allCourses = getTeacherCourses(uuid);
            for(Course c: allCourses)
                if(c.getCourseName().equals(course.getCourseName()))
                    return true;

            return false;
        }
        else if (role.equals("Student")) {

            List<Course> allCourses = getStudentCourses(uuid);
            for (Course c : allCourses)
                if (c.getCourseName().equals(course.getCourseName()))
                    return true;

            return false;
        }
        return false;
    }

    public List<Course> getStudentCourses(String studentuuid) {

        List<Course> courses;
        try {
        courses = getAllCourses();
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }

        List<Course> result = new ArrayList<>();
        courses.forEach(c->{
        if(c.getStudents().contains(studentuuid))
                result.add(c);
        });

        return result;
    }

    public List<Course> getTeacherCourses(String teacheruuid) {

        List<Course> courses;

        try {
            courses = getAllCourses();
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }

        List<Course> result = new ArrayList<>();

        courses.forEach(c->{
            if(c.getTeacher().equals(teacheruuid))
                result.add(c);
        });


        return result;
    }

    public Boolean isTeacher(String uuid) throws ExecutionException, InterruptedException {
        DocumentSnapshot q = db.collection("users").document(uuid).get().get();

        return q.get("role").equals("Teacher");
    }

    public String translateuuid(@NotNull String uuid) throws ExecutionException, InterruptedException {
            DocumentSnapshot q = db.collection("users").document(uuid).get().get();
                return (String) q.get("name");
    }
// --Commented out by Inspection START (03/01/2023 4:06 am):
//    public List<String> translateuuid(@NotNull List<String> uuid) throws ExecutionException, InterruptedException {
//
//      ArrayList<String> names = new ArrayList<>();
//        CollectionReference q = db.collection("users");
//        for(String c: uuid)
//            names.add((String) q.document(c).get().get().get("name"));
//        return names;
//    }
// --Commented out by Inspection STOP (03/01/2023 4:06 am)



    public Map<String, String> getHomeDetails(RequestType rq) throws ExecutionException, InterruptedException {
        HashMap<String, String>result = new HashMap<>();
        DocumentSnapshot q = db.collection("users").document(rq.getUuid()).get().get();
        result.put("name", (String) q.get("name"));

        List<Course> courseList = null;
        if(q.get("role").equals("Teacher"))
            courseList = getTeacherCourses(rq.getUuid());
        else if(q.get("role").equals("Student"))
            courseList = getStudentCourses(rq.getUuid());

        ArrayList<Map<String, Object>> Process = new ArrayList<>();

        for(Course c: courseList)
        {
            HashMap<String, Object> map = new HashMap<>();
            map.put("Teacher", translateuuid(c.getTeacher()));
            map.put("CourseName", c.getCourseName());
            Process.add(map);
        }



        String course = new Gson().toJson(Process);
        result.put("courses", course);
        result.put("role", ((String) q.get("role")));
        return result;
    }
}
