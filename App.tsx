import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

const CoursesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1a1a1a',
      },
      headerTintColor: '#fff',
    }}>
    <Stack.Screen 
      name="CoursesList" 
      component={CoursesScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="CourseDetail" 
      component={CourseDetailScreen}
      options={({ route }: any) => ({ 
        title: route.params.course.name,
        headerShown: true
      })}
    />
  </Stack.Navigator>
);

// Types
interface ApplicationStatus {
  id: string;
  applicationId: string;
  status: 'Pending' | 'Under Review' | 'Accepted' | 'Rejected';
  updatedAt: Date;
  comments?: string;
}

interface FullApplication extends Application {
  id: string;
  status: ApplicationStatus;
  submittedAt: Date;
}

interface Course {
  id: number;
  name: string;
  duration: string;
  fee: number;
  description: string;
  fullDescription: string;
}

interface Venue {
  id: number;
  name: string;
  address: string;
}

interface Application {
  name: string;
  phone: string;
  email: string;
  courseIds: number[];
  venueId: number;
  idNumber: string;
  address: string;
}

// Data

// Mock data for applications
const applications: FullApplication[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '0721234567',
    email: 'john@example.com',
    courseIds: [1, 2],
    venueId: 1,
    idNumber: '1234567890123',
    address: '123 Main St',
    submittedAt: new Date('2024-10-20'),
    status: {
      id: '1',
      applicationId: '1',
      status: 'Pending',
      updatedAt: new Date('2024-10-20'),
    }
  }
];

const courses: Course[] = [
  {
    id: 1,
    name: 'First Aid',
    duration: '6 months',
    fee: 1500,
    description: 'Learn essential first aid skills and basic life support techniques.',
    fullDescription: 'This course aims to provide essential first aid knowledge and basic life support skills. Participants will learn how to manage wounds, bleeding, burns, and fractures, along with emergency scene management. It also covers performing Cardio-Pulmonary Resuscitation (CPR) and responding to respiratory distress scenarios, such as choking or a blocked airway.'
  },
  {
    id: 2,
    name: 'Sewing',
    duration: '6 months',
    fee: 1500,
    description: 'Master the art of sewing, from basic alterations to creating new garments.',
    fullDescription: 'Focused on alterations and garment creation, this course teaches the basics of sewing, including types of stitches, threading a sewing machine, and sewing buttons, zippers, hems, and seams. Students will also learn how to make garment alterations and design and sew new clothing.'
  },
  {
    id: 3,
    name: 'Landscaping',
    duration: '6 months',
    fee: 1500,
    description: 'Discover the principles of landscape design and maintenance.',
    fullDescription: 'This course offers expertise in landscaping for both new and established gardens. It covers knowledge of indigenous and exotic plants, incorporating fixed structures like fountains or benches, and balancing plant arrangements for aesthetic appeal. Participants will also learn about garden layout and design.'
  },
  {
    id: 4,
    name: 'Life Skills',
    duration: '6 months',
    fee: 1500,
    description: 'Develop essential skills for personal and professional growth.',
    fullDescription: 'Designed to equip individuals with essential life skills, this course covers practical aspects such as opening a bank account, understanding basic labor law, and improving literacy in reading, writing, and numeracy. It aims to help participants navigate everyday tasks and challenges effectively.'
  },
  {
    id: 5,
    name: 'Child Minding',
    duration: '6 weeks',
    fee: 750,
    description: 'Learn the fundamentals of childcare and early childhood development.',
    fullDescription: 'This course provides foundational knowledge for taking care of children from birth to toddler age. It covers baby care needs, educational toys, and the developmental stages of children from birth to one year, as well as toddler care techniques.'
  },
  {
    id: 6,
    name: 'Cooking',
    duration: '6 weeks',
    fee: 750,
    description: 'Explore culinary techniques and nutrition basics for healthy meal preparation.',
    fullDescription: 'Focused on nutritious family meal preparation, this course covers the basics of nutritional requirements, different types of protein, carbohydrates, and vegetables, as well as meal planning and cooking techniques. It is ideal for those looking to improve their culinary skills and provide balanced meals.'
  },
  {
    id: 7,
    name: 'Garden Maintenance',
    duration: '6 weeks',
    fee: 750,
    description: 'Learn how to maintain and care for various types of gardens and plants.',
    fullDescription: 'This course teaches basic skills for maintaining a garden, including watering, pruning, and planting. It covers the specific watering needs of indigenous and exotic plants, pruning techniques, and proper planting methods for different plant types.'
  },
];

const venues: Venue[] = [
  { id: 1, name: 'Soweto Training Center', address: '456 Vilakazi Street, Soweto' },
  { id: 2, name: 'Tembisa Community Hub', address: '789 Isibuko Street, Tembisa' },
  { id: 3, name: 'Kagiso Education Center', address: '321 Kagiso Street, Kagiso' },
];

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
  return phoneRegex.test(phone);
};

const validateIdNumber = (idNumber: string): boolean => {
  const idRegex = /^[0-9]{13}$/;
  return idRegex.test(idNumber);
};

const AdminLoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Mock admin credentials - in real app, use secure authentication
    if (username === 'admin' && password === 'admin123') {
      navigation.navigate('AdminDashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Admin Login</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#666"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const AdminDashboardScreen = ({ navigation }: any) => {
  const [applications, setApplications] = useState<FullApplication[]>([]);

  useEffect(() => {
    // In a real app, fetch applications from API
    setApplications(applications);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Admin Dashboard</Text>
      {applications.map((application) => (
        <TouchableOpacity
          key={application.id}
          style={styles.applicationCard}
          onPress={() => navigation.navigate('AdminApplicationDetail', { application })}
        >
          <Text style={styles.applicationName}>{application.name}</Text>
          <Text style={styles.applicationDetail}>
            Status: <Text style={styles.statusText(application.status.status)}>
              {application.status.status}
            </Text>
          </Text>
          <Text style={styles.applicationDetail}>
            Submitted: {new Date(application.submittedAt).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const AdminApplicationDetailScreen = ({ route, navigation }: any) => {
  const { application } = route.params;
  const [status, setStatus] = useState(application.status.status);
  const [comments, setComments] = useState(application.status.comments || '');

  const handleUpdateStatus = () => {
    // In a real app, update status via API
    Alert.alert('Status Updated', 'Application status has been updated successfully');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>Application Details</Text>
        <Text style={styles.detailText}>Name: {application.name}</Text>
        <Text style={styles.detailText}>Email: {application.email}</Text>
        <Text style={styles.detailText}>Phone: {application.phone}</Text>
        <Text style={styles.detailText}>ID Number: {application.idNumber}</Text>
        
        <Text style={styles.subheading}>Update Status</Text>
        <View style={styles.statusContainer}>
          {['Pending', 'Under Review', 'Accepted', 'Rejected'].map((statusOption) => (
            <TouchableOpacity
              key={statusOption}
              style={[
                styles.statusButton,
                status === statusOption && styles.selectedStatus,
              ]}
              onPress={() => setStatus(statusOption)}
            >
              <Text style={styles.statusButtonText}>{statusOption}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={[styles.input, styles.commentsInput]}
          placeholder="Add comments..."
          placeholderTextColor="#666"
          value={comments}
          onChangeText={setComments}
          multiline
        />

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateStatus}>
          <Text style={styles.buttonText}>Update Status</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const ApplicationStatusScreen = () => {
  const [idNumber, setIdNumber] = useState('');
  const [application, setApplication] = useState<FullApplication | null>(null);
  const [searched, setSearched] = useState(false);

  const handleCheck = () => {
    // In a real app, fetch status from API
    const foundApplication = applications.find(app => app.idNumber === idNumber);
    setApplication(foundApplication || null);
    setSearched(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Check Application Status</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter ID Number"
          placeholderTextColor="#666"
          value={idNumber}
          onChangeText={setIdNumber}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
          <Text style={styles.buttonText}>Check Status</Text>
        </TouchableOpacity>

        {searched && !application && (
          <Text style={styles.errorText}>No application found for this ID number</Text>
        )}

        {application && (
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>Application Found</Text>
            <Text style={styles.statusText(application.status.status)}>
              Status: {application.status.status}
            </Text>
            <Text style={styles.statusDate}>
              Last Updated: {new Date(application.status.updatedAt).toLocaleDateString()}
            </Text>
            {application.status.comments && (
              <Text style={styles.statusComments}>{application.status.comments}</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};


// Add new Splash Screen component
const SplashScreen = ({ navigation }: any) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('MainApp');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Animated.View
        style={[
          styles.splashContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}>
        <View style={styles.mainContent}>
          <Image
            source={require('./assets/Logo.png')}
            style={styles.splashLogo}
            resizeMode="contain"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.splashTitle}>Empowering</Text>
            <Text style={styles.splashTitle}>the Nation</Text>
          </View>
        </View>
        <View style={styles.developerInfo}>
          <Image
            source={require('./assets/TTC.png')}
            style={styles.developerLogo}
            resizeMode="contain"
          />
          <Text style={styles.developerText}>TechTonicCorp</Text>
        </View>
      </Animated.View>
    </View>
  );
};

// Components
const HomeScreen = () => (
  <ScrollView style={styles.container}>
    <View style={styles.logoContainer}>
      <Image
        source={require('./assets/Logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
    <View style={styles.hero}>
      <Text style={styles.heroTitle}>Empowering the Nation</Text>
      <Text style={styles.heroSubtitle}>
        Upskilling domestic workers and gardeners for a brighter future
      </Text>
    </View>
  </ScrollView>
);

const CourseDetailScreen = ({ route, navigation }: any) => {
  const { course } = route.params;
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>{course.name}</Text>
        <Text style={styles.detailDuration}>Duration: {course.duration}</Text>
        <Text style={styles.detailFee}>Course Fee: R{course.fee}</Text>
        <Text style={styles.detailDescription}>{course.fullDescription}</Text>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => navigation.navigate('Calculate', { selectedCourse: course.id })}>
          <Text style={styles.buttonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const CourseCard = ({ course, onLearnMore, onApply }: { 
  course: Course; 
  onLearnMore: (course: Course) => void;
  onApply: (course: Course) => void;
}) => (
  <View style={styles.courseCard}>
    <Text style={styles.courseTitle}>{course.name}</Text>
    <Text style={styles.courseDescription}>{course.description}</Text>
    <Text style={styles.courseDetails}>Duration: {course.duration}</Text>
    <Text style={styles.courseDetails}>Fee: R{course.fee}</Text>
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.learnMoreButton}
        onPress={() => onLearnMore(course)}>
        <Text style={styles.buttonText}>Learn More</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => onApply(course)}>
        <Text style={styles.buttonText}>Apply Now</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const CoursesScreen = ({ navigation }: any) => {
  const handleApply = (course: Course) => {
    navigation.navigate('Calculate', { selectedCourse: course.id });
  };

  const handleLearnMore = (course: Course) => {
    navigation.navigate('CourseDetail', { course });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Our Courses</Text>
      {courses.map((course) => (
        <CourseCard 
          key={course.id} 
          course={course} 
          onLearnMore={handleLearnMore}
          onApply={handleApply} 
        />
      ))}
    </ScrollView>
  );
};

const CalculatorScreen = ({ route }: any) => {
  const [formData, setFormData] = useState<Application>({
    name: '',
    phone: '',
    email: '',
    courseIds: route?.params?.selectedCourse ? [route.params.selectedCourse] : [],
    venueId: 0,
    idNumber: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid South African phone number';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validateIdNumber(formData.idNumber)) {
      newErrors.idNumber = 'Please enter a valid 13-digit ID number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData.courseIds.length === 0) {
      newErrors.courses = 'Please select at least one course';
    }

    if (formData.venueId === 0) {
      newErrors.venue = 'Please select a venue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please correct the errors in the form');
      return;
    }

    const subtotal = formData.courseIds.reduce(
      (total, courseId) => total + (courses.find((c) => c.id === courseId)?.fee || 0),
      0
    );

    let discount = 0;
    if (formData.courseIds.length === 2) discount = 0.05;
    else if (formData.courseIds.length === 3) discount = 0.1;
    else if (formData.courseIds.length > 3) discount = 0.15;

    const discountAmount = subtotal * discount;
    const discountedTotal = subtotal - discountAmount;
    const vat = discountedTotal * 0.15;
    const totalWithVAT = discountedTotal + vat;

    const selectedCourses = formData.courseIds.map(id => 
      courses.find(c => c.id === id)?.name
    ).join(', ');

    const selectedVenue = venues.find(v => v.id === formData.venueId)?.name;

     Alert.alert(
      'Application Summary',
      `Name: ${formData.name}\n` +
      `Phone: ${formData.phone}\n` +
      `Email: ${formData.email}\n` +
      `Selected Courses: ${selectedCourses}\n` +
      `Training Venue: ${selectedVenue}\n\n` +
      `Subtotal: R${subtotal.toFixed(2)}\n` +
      `Discount (${(discount * 100)}%): R${discountAmount.toFixed(2)}\n` +
      `VAT (15%): R${vat.toFixed(2)}\n` +
      `Total: R${totalWithVAT.toFixed(2)}\n\n` +
      'Would you like to submit your application?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: handleSubmitApplication,
        },
      ]
    );
  };

  const handleSubmitApplication = () => {
    Alert.alert(
      'Application Submitted',
      'Thank you for your application. We will contact you shortly.',
      [
        {
          text: 'OK',
          onPress: () => {
            setFormData({
              name: '',
              phone: '',
              email: '',
              courseIds: [],
              venueId: 0,
              idNumber: '',
              address: '',
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Course Application</Text>
      <View style={styles.form}>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Full Name"
          placeholderTextColor="#666"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="Phone (e.g., 0721234567)"
          placeholderTextColor="#666"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email"
          placeholderTextColor="#666"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={[styles.input, errors.idNumber && styles.inputError]}
          placeholder="ID Number"
          placeholderTextColor="#666"
          value={formData.idNumber}
          onChangeText={(text) => setFormData({ ...formData, idNumber: text })}
          keyboardType="numeric"
        />
        {errors.idNumber && <Text style={styles.errorText}>{errors.idNumber}</Text>}

        <TextInput
          style={[styles.input, errors.address && styles.inputError]}
          placeholder="Residential Address"
          placeholderTextColor="#666"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          multiline
        />
        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

        <Text style={styles.subheading}>Select Venue</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.venueId}
            onValueChange={(itemValue) => setFormData({ ...formData, venueId: itemValue })}
            style={styles.picker}
            dropdownIconColor="#fff"
            itemStyle={styles.pickerItem}>
            <Picker.Item label="Select a venue" value={0} />
            {venues.map((venue) => (
              <Picker.Item 
                key={venue.id} 
                label={venue.name} 
                value={venue.id}
              />
            ))}
          </Picker>
        </View>
        {errors.venue && <Text style={styles.errorText}>{errors.venue}</Text>}

        <Text style={styles.subheading}>Select Courses</Text>
        {courses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={[
              styles.courseSelection,
              formData.courseIds.includes(course.id) && styles.selectedCourse,
            ]}
            onPress={() => {
              setFormData({
                ...formData,
                courseIds: formData.courseIds.includes(course.id)
                  ? formData.courseIds.filter((id) => id !== course.id)
                  : [...formData.courseIds, course.id],
              });
            }}>
            <Text style={styles.courseSelectionText}>
              {course.name} ({course.duration}) - R{course.fee}
            </Text>
          </TouchableOpacity>
        ))}
        {errors.courses && <Text style={styles.errorText}>{errors.courses}</Text>}

        <TouchableOpacity style={styles.calculateButton} onPress={calculateTotal}>
          <Text style={styles.buttonText}>Submit Application</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const ContactScreen = () => (
  <ScrollView style={styles.container}>
    <Text style={styles.sectionTitle}>Contact Us</Text>
    <View style={styles.contactInfo}>
      <Text style={styles.contactText}>Phone: (011) 123-4567</Text>
      <Text style={styles.contactText}>Email: info@empoweringthenation.co.za</Text>
    </View>
    <Text style={styles.venuesTitle}>Our Venues</Text>
    {venues.map((venue) => (
      <View key={venue.id} style={styles.venueCard}>
        <Text style={styles.venueName}>{venue.name}</Text>
        <Text style={styles.venueAddress}>{venue.address}</Text>
      </View>
    ))}
  </ScrollView>
);

const AdminStack = createStackNavigator();

const AdminNavigator = () => (
  <AdminStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1a1a1a',
      },
      headerTintColor: '#fff',
    }}>
    <AdminStack.Screen 
      name="AdminLogin" 
      component={AdminLoginScreen}
      options={{ title: 'Admin Login' }}
    />
    <AdminStack.Screen 
      name="AdminDashboard" 
      component={AdminDashboardScreen}
      options={{ title: 'Admin Dashboard' }}
    />
    <AdminStack.Screen 
      name="AdminApplicationDetail" 
      component={AdminApplicationDetailScreen}
      options={{ title: 'Application Details' }}
    />
  </AdminStack.Navigator>
);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;
        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Courses':
            iconName = focused ? 'book' : 'book-outline';
            break;
          case 'Calculate':
            iconName = focused ? 'calculator' : 'calculator-outline';
            break;
          case 'Contact':
            iconName = focused ? 'call' : 'call-outline';
            break;
          default:
            iconName = 'help';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#ff6b6b',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#1a1a1a',
        borderTopColor: '#333',
      },
    })}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Courses" component={CoursesStack} />
    <Tab.Screen name="Calculate" component={CalculatorScreen} options={{ title: 'Apply' }} />
    <Tab.Screen name="Status" component={ApplicationStatusScreen} />
    <Tab.Screen name="Contact" component={ContactScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
     <NavigationContainer>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="MainApp" component={MainApp} />
          <Stack.Screen name="Admin" component={AdminNavigator} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  logoContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 10,
  },
  logo: {
    width: 350,
    height: 90,
    marginVertical: 10,
  },
  hero: {
    height: 300,
    justifyContent: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    padding: 20,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  courseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  courseDescription: {
    color: '#fff',
    marginBottom: 10,
  },
  courseDetails: {
    color: '#fff',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  learnMoreButton: {
    backgroundColor: '#ff6b6b',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  detailDuration: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  detailFee: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 15,
  },
  detailDescription: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 10,
    marginTop: -5,
  },
  courseSelection: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  courseSelectionText: {
    color: '#fff',
  },
  selectedCourse: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  venueSelection: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  venueSelectionText: {
    color: '#fff',
  },
  selectedVenue: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  calculateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  contactInfo: {
    padding: 20,
  },
  contactText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  venuesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    padding: 20,
    paddingBottom: 10,
  },
  venueCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    margin: 10,
    borderRadius: 5,
  },
  venueName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  venueAddress: {
    color: '#fff',
    fontSize: 14,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60, // Add padding to space from top and bottom
    width: '100%',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 200,
    height: 200,
    marginBottom: 40, // Increased space between logo and title
  },
  titleContainer: {
    alignItems: 'center',
  },
  splashTitle: {
    fontSize: 36, // Increased font size
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2, // Added letter spacing
    lineHeight: 44, // Added line height for better text spacing
    textTransform: 'uppercase', // Made text uppercase for better visual appeal
  },
  developerInfo: {
    alignItems: 'center',
    marginTop: 'auto', // Push to bottom of splashContent
    paddingBottom: 20,
  },
  developerLogo: {
    width: 60,
    height: 60,
    marginBottom: 15, // Increased space between logo and text
  },
  developerText: {
    color: '#fff',
    fontSize: 18, // Increased font size
    fontWeight: '500',
    letterSpacing: 1, // Added letter spacing
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  applicationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    margin: 10,
    borderRadius: 10,
  },
  applicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  applicationDetail: {
    color: '#fff',
    marginBottom: 3,
  },
  statusText: (status: string) => ({
    color: status === 'Accepted' ? '#4CAF50' : 
          status === 'Rejected' ? '#ff4444' :
          status === 'Under Review' ? '#ff9800' : '#fff',
    fontWeight: 'bold',
  }),
  detailText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 10,
  },
  statusButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedStatus: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  statusButtonText: {
    color: '#fff',
  },
  commentsInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  checkButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  statusDate: {
    color: '#fff',
    marginTop: 5,
  },
  statusComments: {
    color: '#fff',
    marginTop: 10,
    fontStyle: 'italic',
  },
   pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  picker: {
    color: '#fff',
    height: 50,
  },
  pickerItem: {
    color: '#fff',
    backgroundColor: '#1a1a1a',
  },
});
