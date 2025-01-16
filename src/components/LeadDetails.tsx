import { useState } from 'react';
import { Lead, Task, Interaction } from '@/interfaces/interfaces';
import { api } from '@/lib/api';
import { FaTimes, FaEdit, FaPlus } from 'react-icons/fa';

interface LeadDetailsProps {
    lead: Lead;
    onClose: () => void;
    onUpdate: () => void;
}

export default function LeadDetails({ lead, onClose, onUpdate }: LeadDetailsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedLead, setEditedLead] = useState(lead);
    const [error, setError] = useState<string | null>(null);
    const [showNewTaskForm, setShowNewTaskForm] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        taskType: 'follow_up'
    });

    const handleSave = async () => {
        try {
            setError(null);
            const response = await api.patch(`/leads/${lead.id}`, editedLead);

            if (response.data?.success) {
                onUpdate();
                setIsEditing(false);
            } else {
                setError('Failed to update lead');
            }
        } catch (error: any) {
            console.error('Error updating lead:', error);
            setError('Failed to update lead. Please try again.');
        }
    };

    const handleCreateTask = async () => {
        try {
            setError(null);
            const response = await api.post('/tasks', {
                ...newTask,
                leadId: lead.id
            });

            if (response.data?.success) {
                onUpdate();
                setShowNewTaskForm(false);
                setNewTask({
                    title: '',
                    description: '',
                    dueDate: '',
                    priority: 'medium',
                    taskType: 'follow_up'
                });
            } else {
                setError('Failed to create task');
            }
        } catch (error: any) {
            console.error('Error creating task:', error);
            setError('Failed to create task. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Lead Details</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <FaTimes size={24} />
                        </button>
                    </div>

                    {/* Lead Information */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Lead Information</h3>
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <select
                                            value={editedLead.status}
                                            onChange={(e) => setEditedLead({ ...editedLead, status: e.target.value })}
                                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="qualified">Qualified</option>
                                            <option value="converted">Converted</option>
                                            <option value="lost">Lost</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                                        <textarea
                                            value={editedLead.notes}
                                            onChange={(e) => setEditedLead({ ...editedLead, notes: e.target.value })}
                                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Next Follow-up Date</label>
                                        <input
                                            type="datetime-local"
                                            value={editedLead.nextFollowUpDate?.toString().slice(0, 16) || ''}
                                            onChange={(e) => setEditedLead({ ...editedLead, nextFollowUpDate: new Date(e.target.value) })}
                                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p><span className="font-medium">Lead No:</span> {lead.leadNo}</p>
                                    <p><span className="font-medium">Status:</span> {lead.status}</p>
                                    <p><span className="font-medium">Score:</span> {lead.score}</p>
                                    <p><span className="font-medium">Notes:</span> {lead.notes}</p>
                                    <p><span className="font-medium">Last Contact:</span> {lead.lastContactDate ? new Date(lead.lastContactDate).toLocaleString() : 'N/A'}</p>
                                    <p><span className="font-medium">Next Follow-up:</span> {lead.nextFollowUpDate ? new Date(lead.nextFollowUpDate).toLocaleString() : 'N/A'}</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                            <div className="space-y-4">
                                <p><span className="font-medium">Name:</span> {lead.customer.name}</p>
                                <p><span className="font-medium">Phone:</span> {lead.customer.phone}</p>
                                <p><span className="font-medium">Email:</span> {lead.customer.email}</p>
                                <p><span className="font-medium">Address:</span> {lead.customer.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tasks Section */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Tasks</h3>
                            <button
                                onClick={() => setShowNewTaskForm(true)}
                                className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-blue-600"
                            >
                                <FaPlus size={14} /> New Task
                            </button>
                        </div>

                        {showNewTaskForm && (
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                                        <input
                                            type="datetime-local"
                                            value={newTask.dueDate}
                                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                                        <select
                                            value={newTask.priority}
                                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Type</label>
                                        <select
                                            value={newTask.taskType}
                                            onChange={(e) => setNewTask({ ...newTask, taskType: e.target.value })}
                                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                        >
                                            <option value="follow_up">Follow Up</option>
                                            <option value="meeting">Meeting</option>
                                            <option value="call">Call</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowNewTaskForm(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreateTask}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Create Task
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {lead.tasks && lead.tasks.length > 0 ? (
                                lead.tasks.map((task) => (
                                    <div key={task.id} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">{task.title}</h4>
                                                <p className="text-sm text-gray-600">{task.description}</p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Due: {new Date(task.dueDate).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`px-2 py-1 text-xs rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {task.priority}
                                            </span>
                                            <span className={`px-2 py-1 text-xs rounded-full ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                    task.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-center py-4">No tasks found for this lead.</div>
                            )}
                        </div>
                    </div>

                    {/* Interaction History */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Interaction History</h3>
                        <div className="space-y-4">
                            {lead.interactionHistory && lead.interactionHistory.length > 0 ? (
                                lead.interactionHistory.map((interaction, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">{interaction.type}</p>
                                                <p className="text-sm text-gray-600">{interaction.notes}</p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(interaction.timestamp).toLocaleString()}
                                                <p className="text-xs">by {interaction.user}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-center py-4">No interaction history found for this lead.</div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end gap-4">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                            >
                                <FaEdit /> Edit Lead
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 