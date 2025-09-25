import { Day, PrismaClient, Role, PassStatus } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const major = await prisma.major.create({
    data: {
      name: "วิทยาศาสตรบัณฑิต",
      code: "BC1234",
    },
  });

  const department = await prisma.department.create({
    data: {
      name: "วิทยาการคอมพิวเตอร์",
      code: "BS1234",
      major_id: major.id,
    },
  });

  const semesterYear1 = await prisma.semester_year.create({
    data: {
      year_name: "2564",
      semester_name: "1",
    },
  });

  await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      first_name: "Alice",
      code: "b6022345",
      password: bcrypt.hashSync("1234", 10),
      department_id: department.id,
      semester_year_id: semesterYear1.id,
      availability: {
        create: [
          {
            day: Day.Mon,
            start_time: new Date("1970-01-01T09:00:00.000Z"),
            end_time: new Date("1970-01-01T17:00:00.000Z"),
          },
          {
            day: Day.Tue,
            start_time: new Date("1970-01-01T09:00:00.000Z"),
            end_time: new Date("1970-01-01T17:00:00.000Z"),
          },
        ],
      },
      post: {
        create: [
          { name: "Follow Prisma on Twitter" },
          { name: "Follow Nexus on Twitter" },
        ],
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      email: "bob@prisma.io",
      first_name: "Bob",
      code: "b601234",
      password: bcrypt.hashSync("1234", 10),
      department_id: department.id,
      semester_year_id: semesterYear1.id,
      availability: {
        create: [
          {
            day: Day.Mon,
            start_time: new Date("1970-01-01T09:00:00.000Z"),
            end_time: new Date("1970-01-01T17:00:00.000Z"),
          },
          {
            day: Day.Tue,
            start_time: new Date("1970-01-01T09:00:00.000Z"),
            end_time: new Date("1970-01-01T17:00:00.000Z"),
          },
        ],
      },
      post: {
        create: [
          { name: "Follow Prisma on Twitter" },
          { name: "Follow Nexus on Twitter" },
        ],
      },
    },
  });

  const tester = await prisma.user.upsert({
    where: { email: "test@prisma.io" },
    update: {},
    create: {
      email: "test@prisma.io",
      first_name: "Test",
      code: "b6321651575",
      password: bcrypt.hashSync("1234", 10),
      department_id: department.id,
      semester_year_id: semesterYear1.id,
      availability: {
        create: [
          {
            day: Day.Mon,
            start_time: new Date("1970-01-01T09:00:00.000Z"),
            end_time: new Date("1970-01-01T17:00:00.000Z"),
          },
          {
            day: Day.Tue,
            start_time: new Date("1970-01-01T09:00:00.000Z"),
            end_time: new Date("1970-01-01T17:00:00.000Z"),
          },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "admin@admin.com",
      first_name: "Admin",
      code: "admin",
      password: bcrypt.hashSync("1234", 10),
      department_id: department.id,
      role: Role.ADMIN,
    },
  });

// Create teacher records first
const teacherJohn = await prisma.teacher.create({
  data: {
    email: "john@prisma.io",
    first_name: "John",
    last_name: "Doe",
    code: "t001",
    password: bcrypt.hashSync("1234", 10),
    department_id: department.id,
  },
});

const teacherJane = await prisma.teacher.create({
  data: {
    email: "jane@prisma.io",
    first_name: "Jane",
    last_name: "Doe",
    code: "t002",
    password: bcrypt.hashSync("1234", 10),
    department_id: department.id,
  },
});

  // Remove duplicate declaration of semester_year1, use semesterYear1 from above
  const semester_year1 = await prisma.semester_year.create({
    data: {
      year_name: "2564",
      semester_name: "1",
    },
  });

  const semester_year2 = await prisma.semester_year.create({
    data: {
      year_name: "2564",
      semester_name: "2",
    },
  });

  const semester_year3 = await prisma.semester_year.create({
    data: {
      year_name: "2565",
      semester_name: "1",
    },
  });

  const semester_year4 = await prisma.semester_year.create({
    data: {
      year_name: "2565",
      semester_name: "2",
    },
  });
  const semesterYears = [
    { year_name: "2564", semester_name: "1" },
    { year_name: "2564", semester_name: "2" },
    { year_name: "2565", semester_name: "1" },
    { year_name: "2565", semester_name: "2" },
    { year_name: "2566", semester_name: "1" },
    { year_name: "2566", semester_name: "2" },
    { year_name: "2567", semester_name: "1" },
    { year_name: "2567", semester_name: "2" },
  ];

  const semesterYearRecords = await Promise.all(
    semesterYears.map((semester) =>
      prisma.semester_year.create({ data: semester }),
    ),
  );

  const coursesByTerm = {
    "2564-1": [
      { name: "Calculus I", code: "01417111", unit: 3 },
      { name: "Fundamentals of Computing", code: "01418112", unit: 3 },
      { name: "Introduction to Computer Science", code: "01418114", unit: 2 },
      { name: "The King's Philosophy", code: "01999111", unit: 2 },
      { name: "Thai Language", code: "LANG101", unit: 3 },
      { name: "Foreign Language I", code: "LANG102", unit: 3 },
      { name: "Elective", code: "ELECTIVE101", unit: 3 },
    ],
    "2564-2": [
      { name: "Calculus II", code: "01417112", unit: 3 },
      { name: "Computer Programming", code: "01418113", unit: 3 },
      { name: "Discrete Mathematics", code: "01418132", unit: 4 },
      { name: "Physical Education", code: "01175XXX", unit: 1 },
      { name: "Entrepreneurship", code: "GEN102", unit: 3 },
      { name: "Global Citizenship", code: "GEN103", unit: 1 },
      { name: "Aesthetics", code: "GEN104", unit: 3 },
    ],
    "2565-1": [
      { name: "Linear Algebra", code: "01417322", unit: 3 },
      { name: "Software Construction", code: "01418211", unit: 3 },
      { name: "Data Structures", code: "01418231", unit: 3 },
      { name: "Statistics", code: "01422111", unit: 3 },
      { name: "Information Science", code: "INFO101", unit: 1 },
      { name: "Health and Wellness", code: "GEN105", unit: 2 },
      { name: "Science Elective", code: "SCIENCE101", unit: 3 },
    ],
    "2565-2": [
      { name: "Introduction to Database Systems", code: "01418221", unit: 3 },
      { name: "Algorithm Design and Analysis", code: "01418232", unit: 3 },
      { name: "Assembly Language and Computer Architecture", code: "01418233", unit: 4 },
      { name: "Elective", code: "ELECTIVE102", unit: 3 },
      { name: "Foreign Language II", code: "LANG103", unit: 3 },
      { name: "Science Elective", code: "SCIENCE102", unit: 2 },
    ],
    "2566-1": [
      { name: "Systems Analysis and Design", code: "01418321", unit: 3 },
      { name: "Operating Systems", code: "01418331", unit: 4 },
      { name: "Intellectual Property and Professional Ethics", code: "01418341", unit: 3 },
      { name: "Seminar", code: "01418497", unit: 1 },
      { name: "Elective", code: "ELECTIVE201", unit: 3 },
      { name: "Foreign Language III", code: "LANG104", unit: 3 },
    ],
    "2566-2": [
      { name: "Information Security", code: "01418332", unit: 3 },
      { name: "Automata Theory", code: "01418333", unit: 2 },
      { name: "Compiler Techniques", code: "01418334", unit: 2 },
      { name: "Computer Communication and Cloud Computing", code: "01418351", unit: 3 },
      { name: "Co-op Preparation", code: "01418390", unit: 1 },
      { name: "Elective", code: "ELECTIVE202", unit: 3 },
      { name: "Free Elective", code: "FREEELECTIVE101", unit: 3 },
    ],
    "2567-1": [
      { name: "Co-operative Education", code: "01418490", unit: 6 },
    ],
    "2567-2": [
      { name: "Computer Science Project", code: "01418499", unit: 3 },
      { name: "Elective", code: "ELECTIVE301", unit: 9 },
      { name: "Free Elective", code: "FREEELECTIVE102", unit: 3 },
    ],
  };
  
  for (const [term, courseList] of Object.entries(coursesByTerm)) {
    const [year, semester] = term.split("-");
    const semesterYear = semesterYearRecords.find(
      (record) =>
        record.year_name === year && record.semester_name === semester,
    );

    if (!semesterYear) continue;

    for (const course of courseList) {
      await prisma.course.create({
        data: {
          name: course.name,
          code: course.code,
          unit: course.unit,
          isActive: true,
          department: { connect: { id: department.id } },
          semester_year: { connect: { id: semesterYear.id } },
        },
      });
    }
  }

  console.log("Courses seeded successfully.");


  
  const Time = [
    [
      {
        day: Day.Mon,
        start_time: new Date("1970-01-01T08:00:00.000Z"),
        end_time: new Date("1970-01-01T11:00:00.000Z"),
      },
      {
        day: Day.Wed,
        start_time: new Date("1970-01-01T08:00:00.000Z"),
        end_time: new Date("1970-01-01T11:00:00.000Z"),
      },
    ],
    [
      {
        day: Day.Tue,
        start_time: new Date("1970-01-01T06:00:00.000Z"),
        end_time: new Date("1970-01-01T08:00:00.000Z"),
      },
      {
        day: Day.Fri,
        start_time: new Date("1970-01-01T13:00:00.000Z"),
        end_time: new Date("1970-01-01T15:00:00.000Z"),
      },
    ],
    [
      {
        day: Day.Tue,
        start_time: new Date("1970-01-01T15:00:00.000Z"),
        end_time: new Date("1970-01-01T18:00:00.000Z"),
      },
      {
        day: Day.Wed,
        start_time: new Date("1970-01-01T10:00:00.000Z"),
        end_time: new Date("1970-01-01T12:00:00.000Z"),
      },
    ],
    [
      {
        day: Day.Mon,
        start_time: new Date("1970-01-01T14:30:00.000Z"),
        end_time: new Date("1970-01-01T16:30:00.000Z"),
      },
      {
        day: Day.Tue,
        start_time: new Date("1970-01-01T13:00:00.000Z"),
        end_time: new Date("1970-01-01T15:00:00.000Z"),
      },
    ],
  ];

  const courses = [
    {
      name: "Fundamentals of Computing",
      code: "01418112",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } }
    },
    {
      name: "Software Construction",
      code: "01418211",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJane.id } },
    },
    {
      name: "C Programming",
      code: "01418212",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJane.id } },
    },
    {
      name: "COBOL Programming",
      code: "01418213",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Practicum in Software Development",
      code: "01418214",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Introduction to Database Systems",
      code: "01418221",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Data Structure and Algorithm Analysis",
      code: "01418222",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Algorithm Design and Analysis",
      code: "01418223",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Microcontroller and System Programming",
      code: "01418234",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Operating Systems and Shell Programming",
      code: "01418235",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Fundamentals of Information Technology",
      code: "01418241",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Principles of Artificial Intelligence",
      code: "01418251",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Principles of Computer Animation",
      code: "01418261",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Image and Video Processing",
      code: "01418262",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Internet Technology and Web Services",
      code: "01418441",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Human-Computer Interaction",
      code: "01418442",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Mobile Application Development",
      code: "01418443",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Data Communications and Networks",
      code: "01418451",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Parallel Computing with CUDA",
      code: "01418452",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Enterprise Software Development",
      code: "01418471",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Decision Support Systems",
      code: "01418481",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Data Visualization",
      code: "01418324",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Theory of Computation",
      code: "01418332",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Computer Security",
      code: "01418333",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Compiler Techniques",
      code: "01418334",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
    {
      name: "Enterprise Resource Planning Systems",
      code: "01418341",
      unit: 3,
      isActive: true, // Add this line
      department: { connect: { id: department.id } },
      semester_year: {
        connect: [
          { id: semester_year1.id },
          { id: semester_year2.id },
          { id: semester_year3.id },
          { id: semester_year4.id },
        ],
      },
      teacher: { connect: { id: teacherJohn.id } },
    },
  ];

  for (const course of courses) {
    const courseItem = await prisma.course.upsert({
      where: { code: course.code },
      update: {},
      create: course,
    });
    // section_course
    const section_course1 = await prisma.section_course.create({
      data: {
        name: "sec800",
        amount: 50,
        register_amount: 0,
        course_id: courseItem.id,
        semester_year_id: semester_year1.id,
        teacher_id: teacherJohn.id,
      },
    });

    if (section_course1) {
      // create section_time
      const randomTime = Time[Math.floor(Math.random() * Time.length)];

      if (!randomTime) throw new Error("randomTime is undefined");
      for (const time of randomTime) {
        await prisma.section_time.create({
          data: {
            date: time.day,
            start_time: time.start_time,
            end_time: time.end_time,
            section_course: {
              connect: {
                id: section_course1.id,
              },
            },
          },
        });
      }
    }

    // Define mandatory courses for a specific major
    const mandatoryCourses = ["01418112", "01418114"]; // Add the course codes of mandatory courses

    if (mandatoryCourses.includes(courseItem.code)) {
      await prisma.mandatory_course.create({
        data: {
          major_id: major.id,
          course_id: courseItem.id,
        },
      });
    }

    // Assign courses to the tester user with full credits
    await prisma.course_student.create({
      data: {
        section_course_id: section_course1.id,
        status: PassStatus.Pass,
        course_id: courseItem.id,
        student_id: tester.id,
        creditsEarned: courseItem.unit,
      },
    });
  }

  // Define course prerequisites (example data, replace with actual prerequisite mappings)
  const courseConditions = [
    { course_code: "01418211", prerequisite_code: "01418212" },
    { course_code: "01418213", prerequisite_code: "01418212" },
    { course_code: "01418223", prerequisite_code: "01418222" },
    { course_code: "01418235", prerequisite_code: "01418236" },
    { course_code: "01418261", prerequisite_code: "01418251" },
    { course_code: "01418262", prerequisite_code: "01418251" },
    { course_code: "01418481", prerequisite_code: "01418324" },
  ];

  // Create course prerequisites
  for (const condition of courseConditions) {
    const course = await prisma.course.findUnique({
      where: { code: condition.course_code },
    });

    const prerequisite = await prisma.course.findUnique({
      where: { code: condition.prerequisite_code },
    });

    if (course) {
      const section_course1 = await prisma.section_course.create({
        data: {
          name: "sec800",
          amount: 50,
          register_amount: 0,
          course_id: course.id,
          semester_year_id: semester_year1.id,
        },
      });

      if (section_course1) {
        const randomTime = Time[Math.floor(Math.random() * Time.length)];

        if (!randomTime) throw new Error("randomTime is undefined");
        for (const time of randomTime) {
          await prisma.section_time.create({
            data: {
              date: time.day,
              start_time: time.start_time,
              end_time: time.end_time,
              section_course: {
                connect: {
                  id: section_course1.id,
                },
              },
            },
          });
        }
      }

      const section_course2 = await prisma.section_course.create({
        data: {
          name: "sec801",
          amount: 50,
          register_amount: 0,
          course_id: course.id,
          semester_year_id: semester_year1.id,
        },
      });

      if (section_course2) {
        const randomTime = Time[Math.floor(Math.random() * Time.length)];

        if (!randomTime) throw new Error("randomTime is undefined");
        for (const time of randomTime) {
          await prisma.section_time.create({
            data: {
              date: time.day,
              start_time: time.start_time,
              end_time: time.end_time,
              section_course: {
                connect: {
                  id: section_course2.id,
                },
              },
            },
          });
        }
      }
    }

    if (course && prerequisite) {
      await prisma.course_condition.create({
        data: {
          course_id: course.id,
          prerequisite_id: prerequisite.id,
        },
      });
    }
  }

  try {
    await prisma.current_semester.create({
      data: {
        semester_year_id: semester_year1.id,
      },
    });
  } catch (e) {
    console.error(e);
  }

  const news = [
    {
      title: 'Breaking News 1',
      content: 'This is the content for breaking news 1.',
      publishedAt: new Date('2024-07-01T10:00:00Z'),
    },
    {
      title: 'Breaking News 2',
      content: 'This is the content for breaking news 2.',
      publishedAt: new Date('2024-07-02T10:00:00Z'),
    },
    {
      title: 'Breaking News 3',
      content: 'This is the content for breaking news 3.',
      publishedAt: new Date('2024-07-03T10:00:00Z'),
    },
  ];

  for (const newsItem of news) {
    await prisma.news.create({
      data: newsItem,
    });
  }
}

// Function to check if a course is active
async function isCourseActive(courseId: number): Promise<boolean> {
  const currentSemester = await prisma.current_semester.findFirst({
    select: { semester_year_id: true },
  });

  if (!currentSemester) {
    throw new Error("No current semester found");
  }

  const activeCourse = await prisma.course.findFirst({
    where: {
      id: courseId,
      isActive: true,
    },
  });

  const activeSection = await prisma.section_course.findFirst({
    where: {
      course_id: courseId,
      semester_year_id: currentSemester.semester_year_id,
    },
  });

  return activeCourse !== null && activeSection !== null;
}

// Usage example within main
async function checkCourseActivity() {
  const target = await prisma.course.findUnique({
    where: { code: "01418112" }, // one from your second list
    select: { id: true },
  });

  if (!target) {
    console.log("Target course not found");
    return;
  }

  const isActive = await isCourseActive(target.id);
  console.log(`Is course ${target.id} active?`, isActive);
}


main()
  .then(async () => {
    await checkCourseActivity(); // Check course activity after seeding data
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
