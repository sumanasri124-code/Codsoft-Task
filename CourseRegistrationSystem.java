import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.ArrayList;

public class CourseRegistrationSystem extends JFrame {

    private Student student;
    private ArrayList<Course> courses;

    private DefaultTableModel availableModel;
    private DefaultTableModel registeredModel;

    private JLabel coursesLabel;

    public CourseRegistrationSystem() {

        courses = new ArrayList<>();

        addCourses();

        setTitle("Student Course Registration System");
        setSize(800, 500);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        // Enter Student ID
        String id = getStudentInput("Enter Student ID:");

        // Enter Student Name
        String name = getStudentInput("Enter Student Name:");

        // Default values if user cancels or leaves empty
        if (id == null || id.trim().isEmpty()) {
            id = "S001";
        }

        if (name == null || name.trim().isEmpty()) {
            name = "Student";
        }

        student = new Student(id, name);

        createUI();

        setVisible(true);
    }

    // =====================================================
    // MEDIUM SIZE INPUT BOX
    // =====================================================

    private String getStudentInput(String message) {

        JDialog dialog = new JDialog(
                this,
                "Student Details",
                true
        );

        dialog.setSize(400, 180);
        dialog.setLocationRelativeTo(this);
        dialog.setResizable(false);

        JPanel panel = new JPanel(
                new BorderLayout(10, 10)
        );

        panel.setBorder(
                BorderFactory.createEmptyBorder(
                        20,
                        20,
                        20,
                        20
                )
        );

        JLabel label = new JLabel(message);

        label.setFont(
                new Font(
                        "Arial",
                        Font.PLAIN,
                        14
                )
        );

        JTextField textField = new JTextField();

        textField.setPreferredSize(
                new Dimension(300, 30)
        );

        JButton okButton = new JButton("OK");

        JButton cancelButton =
                new JButton("Cancel");

        JPanel buttonPanel = new JPanel();

        buttonPanel.add(okButton);
        buttonPanel.add(cancelButton);

        panel.add(
                label,
                BorderLayout.NORTH
        );

        panel.add(
                textField,
                BorderLayout.CENTER
        );

        panel.add(
                buttonPanel,
                BorderLayout.SOUTH
        );

        final String[] result = {null};

        okButton.addActionListener(e -> {

            result[0] =
                    textField.getText();

            dialog.dispose();
        });

        cancelButton.addActionListener(e -> {

            dialog.dispose();
        });

        dialog.add(panel);

        dialog.setVisible(true);

        return result[0];
    }

    // =====================================================
    // ADD COURSES
    // =====================================================

    private void addCourses() {

        courses.add(
                new Course(
                        "CS101",
                        "Java Programming",
                        30
                )
        );

        courses.add(
                new Course(
                        "CS201",
                        "Data Structures",
                        25
                )
        );

        courses.add(
                new Course(
                        "CS301",
                        "Algorithms",
                        20
                )
        );

        courses.add(
                new Course(
                        "CS401",
                        "Database Management",
                        30
                )
        );

        courses.add(
                new Course(
                        "CS501",
                        "Web Development",
                        35
                )
        );

        courses.add(
                new Course(
                        "MATH101",
                        "Discrete Mathematics",
                        25
                )
        );
    }

    // =====================================================
    // CREATE USER INTERFACE
    // =====================================================

    private void createUI() {

        // ---------------- TOP PANEL ----------------

        JPanel topPanel = new JPanel(
                new BorderLayout()
        );

        topPanel.setBorder(
                BorderFactory.createEmptyBorder(
                        10,
                        10,
                        10,
                        10
                )
        );

        JLabel welcomeLabel = new JLabel(
                "Welcome, " + student.getName()
        );

        welcomeLabel.setFont(
                new Font(
                        "Arial",
                        Font.BOLD,
                        16
                )
        );

        JButton logoutButton =
                new JButton("Logout");

        logoutButton.addActionListener(
                e -> System.exit(0)
        );

        topPanel.add(
                welcomeLabel,
                BorderLayout.WEST
        );

        topPanel.add(
                logoutButton,
                BorderLayout.EAST
        );

        add(
                topPanel,
                BorderLayout.NORTH
        );

        // ---------------- TABS ----------------

        JTabbedPane tabs =
                new JTabbedPane();

        JPanel availablePanel =
                createAvailableCoursesPanel();

        JPanel registeredPanel =
                createRegisteredCoursesPanel();

        JPanel profilePanel =
                createProfilePanel();

        tabs.addTab(
                "Available Courses",
                availablePanel
        );

        tabs.addTab(
                "My Courses",
                registeredPanel
        );

        tabs.addTab(
                "My Profile",
                profilePanel
        );

        add(
                tabs,
                BorderLayout.CENTER
        );
    }

    // =====================================================
    // AVAILABLE COURSES PANEL
    // =====================================================

    private JPanel createAvailableCoursesPanel() {

        JPanel panel =
                new JPanel(
                        new BorderLayout()
                );

        panel.setBorder(
                BorderFactory.createEmptyBorder(
                        10,
                        10,
                        10,
                        10
                )
        );

        availableModel =
                new DefaultTableModel(
                        new String[]{
                                "Code",
                                "Course",
                                "Available Slots"
                        },
                        0
                );

        JTable availableTable =
                new JTable(availableModel);

        availableTable.setRowHeight(25);

        refreshAvailableTable();

        JButton registerButton =
                new JButton(
                        "Register Course"
                );

        registerButton.setPreferredSize(
                new Dimension(180, 40)
        );

        registerButton.addActionListener(
                e -> registerCourse(
                        availableTable
                )
        );

        panel.add(
                new JScrollPane(
                        availableTable
                ),
                BorderLayout.CENTER
        );

        panel.add(
                registerButton,
                BorderLayout.SOUTH
        );

        return panel;
    }

    // =====================================================
    // REGISTERED COURSES PANEL
    // =====================================================

    private JPanel createRegisteredCoursesPanel() {

        JPanel panel =
                new JPanel(
                        new BorderLayout()
                );

        panel.setBorder(
                BorderFactory.createEmptyBorder(
                        10,
                        10,
                        10,
                        10
                )
        );

        registeredModel =
                new DefaultTableModel(
                        new String[]{
                                "Code",
                                "Course"
                        },
                        0
                );

        JTable registeredTable =
                new JTable(registeredModel);

        registeredTable.setRowHeight(25);

        refreshRegisteredTable();

        JButton dropButton =
                new JButton(
                        "Drop Course"
                );

        dropButton.setPreferredSize(
                new Dimension(180, 40)
        );

        dropButton.addActionListener(
                e -> dropCourse(
                        registeredTable
                )
        );

        panel.add(
                new JScrollPane(
                        registeredTable
                ),
                BorderLayout.CENTER
        );

        panel.add(
                dropButton,
                BorderLayout.SOUTH
        );

        return panel;
    }

    // =====================================================
    // PROFILE PANEL
    // =====================================================

    private JPanel createProfilePanel() {

        JPanel panel = new JPanel();

        panel.setLayout(
                new BoxLayout(
                        panel,
                        BoxLayout.Y_AXIS
                )
        );

        panel.setBorder(
                BorderFactory.createEmptyBorder(
                        30,
                        30,
                        30,
                        30
                )
        );

        JLabel title =
                new JLabel(
                        "Student Profile"
                );

        title.setFont(
                new Font(
                        "Arial",
                        Font.BOLD,
                        20
                )
        );

        JLabel idLabel =
                new JLabel(
                        "Student ID: "
                                + student.getId()
                );

        idLabel.setFont(
                new Font(
                        "Arial",
                        Font.PLAIN,
                        14
                )
        );

        JLabel nameLabel =
                new JLabel(
                        "Name: "
                                + student.getName()
                );

        nameLabel.setFont(
                new Font(
                        "Arial",
                        Font.PLAIN,
                        14
                )
        );

        // IMPORTANT:
        // This label is stored in a variable
        // so we can update it later.

        coursesLabel =
                new JLabel(
                        "Registered Courses: "
                                + student.getCourses().size()
                );

        coursesLabel.setFont(
                new Font(
                        "Arial",
                        Font.PLAIN,
                        14
                )
        );

        panel.add(title);

        panel.add(
                Box.createVerticalStrut(20)
        );

        panel.add(idLabel);

        panel.add(
                Box.createVerticalStrut(10)
        );

        panel.add(nameLabel);

        panel.add(
                Box.createVerticalStrut(10)
        );

        panel.add(coursesLabel);

        return panel;
    }

    // =====================================================
    // REFRESH AVAILABLE COURSES
    // =====================================================

    private void refreshAvailableTable() {

        availableModel.setRowCount(0);

        for (Course course : courses) {

            availableModel.addRow(
                    new Object[]{
                            course.getCode(),
                            course.getName(),
                            course.getAvailableSlots()
                    }
            );
        }
    }

    // =====================================================
    // REFRESH REGISTERED COURSES
    // =====================================================

    private void refreshRegisteredTable() {

        registeredModel.setRowCount(0);

        for (Course course :
                student.getCourses()) {

            registeredModel.addRow(
                    new Object[]{
                            course.getCode(),
                            course.getName()
                    }
            );
        }
    }

    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    private void updateProfile() {

        coursesLabel.setText(
                "Registered Courses: "
                        + student.getCourses().size()
        );
    }

    // =====================================================
    // REGISTER COURSE
    // =====================================================

    private void registerCourse(JTable table) {

        int row =
                table.getSelectedRow();

        // No course selected
        if (row == -1) {

            JOptionPane.showMessageDialog(
                    this,
                    "Please select a course."
            );

            return;
        }

        // Get course code
        String code =
                (String) table.getValueAt(
                        row,
                        0
                );

        // Find course
        Course course =
                findCourse(code);

        if (course == null) {

            JOptionPane.showMessageDialog(
                    this,
                    "Course not found."
            );

            return;
        }

        // Check duplicate registration
        if (student.isRegistered(code)) {

            JOptionPane.showMessageDialog(
                    this,
                    "You are already registered for this course."
            );

            return;
        }

        // Check available slots
        if (course.getAvailableSlots() <= 0) {

            JOptionPane.showMessageDialog(
                    this,
                    "No available slots."
            );

            return;
        }

        // Register student
        student.addCourse(course);

        // Decrease slot
        course.decreaseSlot();

        // Refresh everything
        refreshAvailableTable();

        refreshRegisteredTable();

        updateProfile();

        JOptionPane.showMessageDialog(
                this,
                "Course registered successfully!"
        );
    }

    // =====================================================
    // DROP COURSE
    // =====================================================

    private void dropCourse(JTable table) {

        int row =
                table.getSelectedRow();

        // No course selected
        if (row == -1) {

            JOptionPane.showMessageDialog(
                    this,
                    "Please select a course."
            );

            return;
        }

        // Get course code
        String code =
                (String) table.getValueAt(
                        row,
                        0
                );

        Course course =
                findCourse(code);

        if (course != null) {

            // Remove from student
            student.removeCourse(code);

            // Increase available slot
            course.increaseSlot();

            // Refresh everything
            refreshAvailableTable();

            refreshRegisteredTable();

            updateProfile();

            JOptionPane.showMessageDialog(
                    this,
                    "Course dropped successfully!"
            );
        }
    }

    // =====================================================
    // FIND COURSE
    // =====================================================

    private Course findCourse(
            String code
    ) {

        for (Course course : courses) {

            if (course.getCode().equals(code)) {

                return course;
            }
        }

        return null;
    }

    // =====================================================
    // MAIN METHOD
    // =====================================================

    public static void main(String[] args) {

        SwingUtilities.invokeLater(
                () -> new CourseRegistrationSystem()
        );
    }
}


// =========================================================
// COURSE CLASS
// =========================================================

class Course {

    private String code;
    private String name;

    private int capacity;
    private int availableSlots;

    public Course(
            String code,
            String name,
            int capacity
    ) {

        this.code = code;
        this.name = name;
        this.capacity = capacity;

        this.availableSlots = capacity;
    }

    public String getCode() {

        return code;
    }

    public String getName() {

        return name;
    }

    public int getAvailableSlots() {

        return availableSlots;
    }

    public void decreaseSlot() {

        if (availableSlots > 0) {

            availableSlots--;
        }
    }

    public void increaseSlot() {

        if (availableSlots < capacity) {

            availableSlots++;
        }
    }
}


// =========================================================
// STUDENT CLASS
// =========================================================

class Student {

    private String id;
    private String name;

    private ArrayList<Course> courses;

    public Student(
            String id,
            String name
    ) {

        this.id = id;
        this.name = name;

        courses =
                new ArrayList<>();
    }

    public String getId() {

        return id;
    }

    public String getName() {

        return name;
    }

    public ArrayList<Course> getCourses() {

        return courses;
    }

    public boolean isRegistered(
            String code
    ) {

        for (Course course : courses) {

            if (course.getCode().equals(code)) {

                return true;
            }
        }

        return false;
    }

    public void addCourse(
            Course course
    ) {

        courses.add(course);
    }

    public void removeCourse(
            String code
    ) {

        courses.removeIf(
                course ->
                        course.getCode().equals(code)
        );
    }
}