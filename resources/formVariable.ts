export const formVariable = {
    validUser: {
        firstName: 'Binay',
        lastName: 'Poudel',
        email: 'binay.poudel@gmail.com',
        gender: 'Male',
        phone: '9876543210',
        dateOfBirth: '13 Feb 1996',
        dateOfBirthFull:'13 February,1996',
        subjects: ['Maths', 'Physics'],
        hobbies: ['Sports','Reading', 'Music'],
        file: 'resources/assets/sampleimage.jpg',
        file2: 'resources/assets/covergo.docx',
        address: 'Baneshwar-23, Kathmandu 44600',
        state: ['NCR','Uttar Pradesh','Haryana','Rajasthan'],
        city: 'Delhi',
        genderList:['Male','Female','Other'],
        hobbyCombination : [
                ['Sports'],
                ['Reading'],
                ['Music'],
                ['Sports', 'Reading'],
                ['Sports', 'Music'],
                ['Reading', 'Music'],
                ['Sports', 'Reading', 'Music'],
                ],

    },
    invalidUser: {
    email: 'binay.com',
    phone: ['12345abcdef', 'MobileNumbertext','123456789']
    }
};

export const stateCityMap = {
    'NCR': ['Delhi', 'Gurgaon', 'Noida'],
    'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
    'Haryana': ['Karnal', 'Panipat'],
    'Rajasthan': ['Jaipur', 'Jaiselmer']
  }