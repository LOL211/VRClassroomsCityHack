package com.vrclass.vrclassrooms.DataTypes;

import java.util.List;

public class Course {
    private final List<String> Students;
    private final String Teacher;
    private final String CourseName;

    public Course(List<String> students, String teacher, String CourseName) {
        this.Students = students;
        this.Teacher = teacher;
        this.CourseName = CourseName;
    }

    public List<String> getStudents() {
        return Students;
    }

    public String getTeacher() {
        return Teacher;
    }

    public String getCourseName() {
        return CourseName;
    }

    @Override
    public String toString(){

        return "Course code is "+getCourseName()+" teacher uuid is "+getTeacher()+" students are "+getStudents().toString();
    }

}
