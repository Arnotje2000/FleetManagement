import React, { useEffect, useState, useContext } from 'react';
import Sidebar from '../utils/Sidebar';
import Card from '../utils/Card'; // Import the Card component
import AddEmployeeModal from '../utils/EmployeeModal'; // Import the AddEmployeeModal component
import axios from 'axios'; // Import axios
import { AuthContext } from '../../context/AuthContext';

const EmployeeManagement = () => {
    const { user } = useContext(AuthContext);
    const tenantId = user?.tenantId;
    const [employees, setEmployees] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
    const [newEmployeeRole, setNewEmployeeRole] = useState('Employee');
    const [loggedInUser, setLoggedInUser] = useState(null); // State for logged-in user

    // Fetch employees and admins from the database
    useEffect(() => {
        const fetchEmployeesAndAdmins = async () => {
            if (!tenantId) {
                console.log('No tenantId provided');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5054/api/tenant/${tenantId}`);
                const users = response.data.users?.$values || [];
                
                // Filter out deleted users and map to correct structure
                const processedUsers = users.filter(user => !user.isDeleted).map(user => ({
                    userId: user.userId,
                    email: user.email,
                    isDeleted: user.isDeleted
                }));

                // For now, we'll consider users with 'admin' in their email as admins
                const employeesList = processedUsers.filter(user => !user.email.toLowerCase().includes('admin'));
                const adminsList = processedUsers.filter(user => user.email.toLowerCase().includes('admin'));

                setEmployees(employeesList);
                setAdmins(adminsList);
            } catch (error) {
                console.error('Error fetching users:', error);
                setEmployees([]);
                setAdmins([]);
            }
        };

        if (tenantId) {
            fetchEmployeesAndAdmins();
        }
    }, [tenantId]);

    // Retrieve logged-in user from local storage on component mount
    useEffect(() => {
        const userData = localStorage.getItem('loggedInUser');
        if (userData) {
            setLoggedInUser(JSON.parse(userData));
        }
    }, []);

    // Function to handle delete action
    const handleDelete = async (id) => {
        console.log("Attempting to delete user with ID:", id);

        const employee = employees.find(emp => emp.userId === id) || admins.find(admin => admin.userId === id);

        if (!employee) {
            console.error("User not found.");
            return;
        }

        if (loggedInUser && loggedInUser.userId === id) {
            console.error("You cannot delete your own account.");
            alert("You cannot delete your own account.");
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:5054/api/User/users/${id}`);

            if (response.status === 200) {
                setEmployees(employees.filter(emp => emp.userId !== id));
                setAdmins(admins.filter(admin => admin.userId !== id));
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please try again.');
        }
    };

    // Function to filter employees based on search term
    const filteredEmployees = employees.filter(employee =>
        employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to filter admins based on search term
    const filteredAdmins = admins.filter(admin =>
        admin.email && admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to handle adding a new employee
    const handleAddEmployee = async () => {
        const newEmployee = {
            email: newEmployeeEmail,
            password: "defaultPassword", // You might want to generate this or handle it differently
            userName: newEmployeeEmail.split('@')[0], // Default username from email
            clearanceId: newEmployeeRole === 'Admin' ? 2 : 3, // Update clearance IDs: 2 for Admin, 3 for Employee
            tenantId: tenantId
        };

        try {
            const response = await axios.post('http://localhost:5054/api/tenant/users', newEmployee);

            if (response.status !== 200) {
                throw new Error('Failed to add new employee');
            }

            const addedEmployee = response.data;

            // Update state based on clearance
            if (addedEmployee.clearanceId === 2) {
                setAdmins(prevAdmins => [...prevAdmins, addedEmployee]);
            } else {
                setEmployees(prevEmployees => [...prevEmployees, addedEmployee]);
            }

            setNewEmployeeEmail('');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding new employee:', error);
        }
    };

    console.log("Logged in user:", loggedInUser);
    console.log("Tenant ID:", tenantId);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar type="bedrijfsAdmin" />
            <div className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-6 flex justify-between items-center">
                    Employee Management
                </h1>
                <div className="grid grid-cols-1 gap-6">
                <Card>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center w-full max-w-xs border border-gray-300 rounded px-3 py-1 opacity-50">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-8 font-semibold text-gray-500 placeholder-gray-400 focus:outline-none rounded-lg"
                            />
                        </div>
                        <div className="flex items-center max-w-xs border border-gray-300 rounded px-5 py-1 border-opacity-50">
                            <button 
                                className="h-8 font-semibold whitespace-nowrap hover:text-gray-500"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Add Employees
                            </button>
                        </div>
                    </div>
                </Card>
                <Card title="Company Admins">
                        <table className="min-w-full mt-4">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Role</th>
                                    <th className="px-4 py-2 text-left">Contact (Email)</th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAdmins.map((admin) => (
                                    <tr key={admin.userId} className={`border-b border-gray-300 border-opacity-50 ${loggedInUser && loggedInUser.userId === admin.userId ? 'bg-green-200' : ''}`}>
                                        <td className="px-4 py-2">{admin.userId}</td>
                                        <td className="px-4 py-2">{admin.email.split('@')[0]}</td>
                                        <td className="px-4 py-2">Admin</td>
                                        <td className="px-4 py-2">{admin.email}</td>
                                        <td className="px-4 py-2">
                                            {loggedInUser && loggedInUser.userId !== admin.userId && (
                                                <button
                                                    className="text-red-500 hover:text-red-700 flex items-center justify-center w-full"
                                                    onClick={() => handleDelete(admin.userId)}
                                                >
                                                    <i className="fi fi-rr-trash"></i>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                    <Card title="Company Employees">
                        <table className="min-w-full mt-4">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Role</th>
                                    <th className="px-4 py-2 text-left">Contact (Email)</th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((employee) => (
                                    <tr key={employee.userId} className={`border-b border-gray-300 border-opacity-50 ${loggedInUser && loggedInUser.userId === employee.userId ? 'bg-green-200' : ''}`}>
                                        <td className="px-4 py-2">{employee.userId}</td>
                                        <td className="px-4 py-2">{employee.email.split('@')[0]}</td>
                                        <td className="px-4 py-2">Employee</td>
                                        <td className="px-4 py-2">{employee.email}</td>
                                        <td className="px-4 py-2">
                                            {loggedInUser && loggedInUser.userId !== employee.userId && (
                                                <button
                                                    className="text-red-500 hover:text-red-700 flex items-center justify-center w-full"
                                                    onClick={() => handleDelete(employee.userId)}
                                                >
                                                    <i className="fi fi-rr-trash"></i>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>
            </div>

            {isModalOpen && (
                <AddEmployeeModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddEmployee={handleAddEmployee}
                    newEmployeeEmail={newEmployeeEmail}
                    setNewEmployeeEmail={setNewEmployeeEmail}
                    newEmployeeRole={newEmployeeRole}
                    setNewEmployeeRole={setNewEmployeeRole}
                />
            )}
        </div>
    );
};

export default EmployeeManagement; // Exporting the component for use in other files