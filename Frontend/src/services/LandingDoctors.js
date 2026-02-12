export const LandingDoctors = [
  {
    _id: 1,
    profilImg:
      "https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg",
    name: "Dr. Sarah Johnson",
    specialist: "Cardiologist",
    location: "New York Medical Center",
    description:
      "Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience in treating heart conditions.",
    rating: 4.9,
    reviews: 127,
    doctorStartDate: "2012",
    treatments: 856,
    price: 150,
    timeCycle: "30min",
    booked: [],
    availabe: true,
    educationAndTraining: [
      "MD - Harvard Medical School",
      "Residency - Johns Hopkins Hospital",
      "Fellowship - Mayo Clinic",
    ],
    availableDays: [
      { day: "Monday", start: "9:00 AM", end: "5:00 PM" },
      { day: "Wednesday", start: "9:00 AM", end: "5:00 PM" },
      { day: "Friday", start: "10:00 AM", end: "4:00 PM" },
    ],
  },

  {
    _id: 2,
    profilImg: "",
    name: "Dr. Michael Smith",
    specialist: "Neurologist",
    location: "California Neuro Clinic",
    description:
      "Dr. Michael Smith specializes in neurological disorders including migraines, epilepsy, and stroke management.",
    rating: 4.8,
    reviews: 98,
    doctorStartDate: "2014",
    treatments: 640,
    price: 180,
    timeCycle: "40min",
    booked: [],
    availabe: true,
    educationAndTraining: [
      "MD - Stanford University",
      "Residency - UCLA Medical Center",
      "Fellowship - Cleveland Clinic",
    ],
    availableDays: [
      { day: "Tuesday", start: "10:00 AM", end: "6:00 PM" },
      { day: "Thursday", start: "9:00 AM", end: "5:00 PM" },
    ],
  },

  {
    _id: 3,
    profilImg: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
    name: "Dr. Emily Davis",
    specialist: "Pediatrician",
    location: "Children Care Hospital",
    description:
      "Dr. Emily Davis provides compassionate pediatric care focusing on child development and preventive healthcare.",
    rating: 4.7,
    reviews: 143,
    doctorStartDate: "2015",
    treatments: 920,
    price: 120,
    timeCycle: "30min",
    booked: [],
    availabe: true,
    educationAndTraining: [
      "MD - Yale School of Medicine",
      "Residency - Boston Children's Hospital",
    ],
    availableDays: [
      { day: "Monday", start: "8:00 AM", end: "4:00 PM" },
      { day: "Wednesday", start: "8:00 AM", end: "4:00 PM" },
      { day: "Friday", start: "8:00 AM", end: "2:00 PM" },
    ],
  },

  {
    _id: 4,
    profilImg: "https://images.unsplash.com/photo-1622253692010-333f2da6031d",
    name: "Dr. James Wilson",
    specialist: "Orthopedic Surgeon",
    location: "Advanced Bone & Joint Center",
    description:
      "Dr. James Wilson specializes in joint replacement, sports injuries, and orthopedic trauma.",
    rating: 4.6,
    reviews: 110,
    doctorStartDate: "2010",
    treatments: 780,
    price: 200,
    timeCycle: "45min",
    booked: [],
    availabe: false,
    educationAndTraining: [
      "MD - University of Michigan",
      "Residency - Hospital for Special Surgery",
    ],
    availableDays: [
      { day: "Tuesday", start: "9:00 AM", end: "3:00 PM" },
      { day: "Thursday", start: "11:00 AM", end: "6:00 PM" },
    ],
  },

  {
    _id: 5,
    profilImg: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    name: "Dr. Olivia Martinez",
    specialist: "Ophthalmologist",
    location: "Vision Care Institute",
    description:
      "Dr. Olivia Martinez offers advanced eye care including cataract surgery and vision correction.",
    rating: 4.8,
    reviews: 89,
    doctorStartDate: "2016",
    treatments: 530,
    price: 140,
    timeCycle: "25min",
    booked: [],
    availabe: true,
    educationAndTraining: [
      "MD - Columbia University",
      "Residency - Wills Eye Hospital",
    ],
    availableDays: [
      { day: "Monday", start: "10:00 AM", end: "4:00 PM" },
      { day: "Thursday", start: "10:00 AM", end: "4:00 PM" },
    ],
  },
];

const wantDoctorPending = {
  rating: 4.9,
  reviews: 127,
  doctorStartDate: "2012",
  treatments: 856,
  booked: [],
};

const wantDoctorInfo = {
  specialist: ["Cardiologist", "General Medicine"],
  location: "New York Medical Center",
  description:
    "Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience in treating heart conditions.",
  price: 150,
  timeCycle: "30min",
  availabe: true,
  educationAndTraining: [
    "MD - Harvard Medical School",
    "Residency - Johns Hopkins Hospital",
    "Fellowship - Mayo Clinic",
  ],
  availableDays: [
    { day: "Monday", start: "9:00 AM", end: "5:00 PM" },
    { day: "Wednesday", start: "9:00 AM", end: "5:00 PM" },
    { day: "Friday", start: "10:00 AM", end: "4:00 PM" },
  ],
};
