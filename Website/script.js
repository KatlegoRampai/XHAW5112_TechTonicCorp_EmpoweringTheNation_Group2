const courses = [
    { id: 1, name: 'First Aid', duration: '6 months', fee: 1500, description: 'Learn essential first aid skills and basic life support techniques.' },
    { id: 2, name: 'Sewing', duration: '6 months', fee: 1500, description: 'Master the art of sewing, from basic alterations to creating new garments.' },
    { id: 3, name: 'Landscaping', duration: '6 months', fee: 1500, description: 'Discover the principles of landscape design and maintenance.' },
    { id: 4, name: 'Life Skills', duration: '6 months', fee: 1500, description: 'Develop essential skills for personal and professional growth.' },
    { id: 5, name: 'Child Minding', duration: '6 weeks', fee: 750, description: 'Learn the fundamentals of childcare and early childhood development.' },
    { id: 6, name: 'Cooking', duration: '6 weeks', fee: 750, description: 'Explore culinary techniques and nutrition basics for healthy meal preparation.' },
    { id: 7, name: 'Garden Maintenance', duration: '6 weeks', fee: 750, description: 'Learn how to maintain and care for various types of gardens and plants.' },
];

const venues = [
    { name: 'Tembisa Training Center', address: '123 thete Road, Tembisa' },
    { name: 'Soweto Community Hub', address: '456 Vilakazi Street, Soweto' },
    { name: 'Kagiso Education Center', address: '789 Florence Mphosho road, Rosebank' },
];

document.addEventListener('DOMContentLoaded', () => {
    createCourseBlocks();
    populateVenues();
    setupFeeCalculator();
    setupSmoothScrolling();
});

function createCourseBlocks() {
    const courseGrid = document.getElementById('course-grid');
    courses.forEach(course => {
        const courseBlock = document.createElement('div');
        courseBlock.className = 'course-block';
        courseBlock.innerHTML = `
            <h3>${course.name}</h3>
            <p>${course.description}</p>
            <p>Duration: ${course.duration}</p>
            <p>Fee: R${course.fee}</p>
            <a href="#" class="learn-more" data-course-id="${course.id}">Learn More</a>
        `;
        courseGrid.appendChild(courseBlock);
    });

    // Add event listeners to "Learn More" buttons
    document.querySelectorAll('.learn-more').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const courseId = e.target.getAttribute('data-course-id');
            openCoursePage(courseId);
        });
    });
}

function openCoursePage(courseId) {
    const course = courses.find(c => c.id === parseInt(courseId));
    const coursePageContent = `
        <h1>${course.name}</h1>
        <p>${course.description}</p>
        <p>Duration: ${course.duration}</p>
        <p>Fee: R${course.fee}</p>
        <h2>Course Content:</h2>
        <ul>
            <li>Module 1: Introduction to ${course.name}</li>
            <li>Module 2: Core Principles and Techniques</li>
            <li>Module 3: Practical Applications</li>
            <li>Module 4: Advanced Topics in ${course.name}</li>
        </ul>
        <h2>Apply for this Course</h2>
        <form id="course-application-form">
            <label for="applicant-name">Name:</label>
            <input type="text" id="applicant-name" required>
            <label for="applicant-email">Email:</label>
            <input type="email" id="applicant-email" required>
            <label for="applicant-phone">Phone:</label>
            <input type="tel" id="applicant-phone" required>
            <button type="submit">Submit Application</button>
        </form>
    `;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
        <html>
            <head>
                <title>${course.name} - Empowering the Nation</title>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                <div class="course-page">
                    ${coursePageContent}
                </div>
                <script>
                    document.getElementById('course-application-form').addEventListener('submit', (e) => {
                        e.preventDefault();
                        alert('Thank you for your application. We will contact you soon.');
                    });
                </script>
            </body>
        </html>
    `);
}

document.addEventListener('DOMContentLoaded', () => {
    populateCourses();
    populateVenues();
    setupFeeCalculator();
    setupSmoothScrolling();
});

function populateCourses() {
    const sixMonthList = document.getElementById('six-month-courses');
    const sixWeekList = document.getElementById('six-week-courses');

    courses.forEach(course => {
        const li = document.createElement('li');
        li.textContent = `${course.name} - R${course.fee}`;
        if (course.duration === '6 months') {
            sixMonthList.appendChild(li);
        } else {
            sixWeekList.appendChild(li);
        }
    });
}

function populateVenues() {
    const venuesList = document.getElementById('venues');
    venues.forEach(venue => {
        const li = document.createElement('li');
        li.textContent = `${venue.name}: ${venue.address}`;
        venuesList.appendChild(li);
    });
}

function setupFeeCalculator() {
    const courseSelection = document.getElementById('course-selection');
    const calculateBtn = document.getElementById('calculate-btn');
    const totalFeeElement = document.getElementById('total-fee');

    courses.forEach(course => {
        const div = document.createElement('div');
        div.innerHTML = `
            <input type="checkbox" id="course-${course.id}" name="course" value="${course.id}">
            <label for="course-${course.id}">${course.name} (${course.duration}) - R${course.fee}</label>
        `;
        courseSelection.appendChild(div);
    });

    calculateBtn.addEventListener('click', () => {
        const selectedCourses = Array.from(document.querySelectorAll('input[name="course"]:checked'))
            .map(input => parseInt(input.value));

        const totalFee = calculateTotalFee(selectedCourses);
        totalFeeElement.textContent = `Total Fee (including discount and VAT): R${totalFee.toFixed(2)}`;
        totalFeeElement.style.display = 'block';
    });

    document.getElementById('fee-calculator').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your interest. A consultant will contact you soon.');
    });
}

function calculateTotalFee(selectedCourseIds) {
    const subtotal = selectedCourseIds.reduce((total, courseId) => {
        const course = courses.find(c => c.id === courseId);
        return total + course.fee;
    }, 0);

    let discount = 0;
    if (selectedCourseIds.length === 2) discount = 0.05;
    else if (selectedCourseIds.length === 3) discount = 0.10;
    else if (selectedCourseIds.length > 3) discount = 0.15;

    const discountedTotal = subtotal * (1 - discount);
    const totalWithVAT = discountedTotal * 1.15;

    return totalWithVAT;
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}