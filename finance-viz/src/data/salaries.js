// RPI Class of 2025 Average Reported Starting Salaries

export const salaries = [
  // Architecture
  {
    major: 'Architecture',
    group: 'Architecture',
    degree: "Bachelor's",
    averageSalary: 68289,
    salaryMin: 60000,
    salaryMax: 85000,
  },

  // Engineering
  {
    major: 'Aeronautical/Aerospace Engineering',
    group: 'Engineering',
    degree: "Bachelor's",
    averageSalary: 82214,
    salaryMin: 70000,
    salaryMax: 93000,
  },
  {
    major: 'Biomedical Engineering',
    group: 'Engineering',
    degree: "Bachelor's",
    averageSalary: 78317,
    salaryMin: 56000,
    salaryMax: 85000,
  },
  {
    major: 'Chemical Engineering',
    group: 'Engineering',
    degree: "Bachelor's",
    averageSalary: 81643,
    salaryMin: 52000,
    salaryMax: 108000,
  },
  {
    major: 'Civil Engineering',
    group: 'Engineering',
    degree: "Bachelor's",
    averageSalary: 72585,
    salaryMin: 65000,
    salaryMax: 79000,
  },
  {
    major: 'Computer & Systems Engineering',
    group: 'Engineering',
    degree: "Bachelor's",
    averageSalary: 92333,
    salaryMin: 55000,
    salaryMax: 150000,
  },
  {
    major: 'Electrical Engineering',
    group: 'Engineering',
    degree: "Bachelor's",
    averageSalary: 82740,
    salaryMin: 61000,
    salaryMax: 94400,
  },
  {
    major: 'Environmental Engineering',
    group: 'Engineering',
    degree: "Bachelor's",
    averageSalary: 72245,
    salaryMin: 70000,
    salaryMax: 74490,
  },
  {
    major: 'Industrial & Management Engineering',
    group: 'Engineering',
    degree: "Bachelor's",
    averageSalary: 82100,
    salaryMin: 68000,
    salaryMax: 95000,
  },
  {
    major: 'Mechanical Engineering',
    group: 'Engineering',
    degree: "Bachelor's",
    averageSalary: 79181,
    salaryMin: 62000,
    salaryMax: 93300,
  },

  // Humanities, Arts & Social Sciences
  {
    major: 'Various HASS Majors',
    group: 'Humanities, Arts & Social Sciences',
    degree: "Bachelor's",
    averageSalary: 67253,
    salaryMin: 44720,
    salaryMax: 80000,
  },

  // Management / IT
  {
    major: 'Business Analytics / Business Mgmt / IT',
    group: 'Management/IT',
    degree: "Bachelor's",
    averageSalary: 75501,
    salaryMin: 48194,
    salaryMax: 110000,
  },

  // Science
  {
    major: 'Chemistry & Life/Bio Sciences',
    group: 'Science',
    degree: "Bachelor's",
    averageSalary: 62285,
    salaryMin: 40560,
    salaryMax: 100000,
  },
  {
    major: 'Computer Science',
    group: 'Science',
    degree: "Bachelor's",
    averageSalary: 102936,
    salaryMin: 55000,
    salaryMax: 155000,
  },
  {
    major: 'Math & Physics',
    group: 'Science',
    degree: "Bachelor's",
    averageSalary: 78000,
    salaryMin: 67000,
    salaryMax: 88000,
  },

  // Advanced Degrees
  {
    major: 'MBA',
    group: 'Advanced Degrees',
    degree: 'MBA',
    averageSalary: 90150,
    salaryMin: 60000,
    salaryMax: 135000,
  },
  {
    major: 'ME/MS',
    group: 'Advanced Degrees',
    degree: "Master's",
    averageSalary: 95903,
    salaryMin: 60000,
    salaryMax: 140000,
  },
  {
    major: 'PhD (Industry)',
    group: 'Advanced Degrees',
    degree: 'PhD',
    averageSalary: 143927,
    salaryMin: 99960,
    salaryMax: 181958,
  },
]

export const salaryGroups = [...new Set(salaries.map((s) => s.group))]

export const bachelorSalaries = salaries.filter((s) => s.degree === "Bachelor's")
export const advancedSalaries = salaries.filter((s) => s.group === 'Advanced Degrees')
