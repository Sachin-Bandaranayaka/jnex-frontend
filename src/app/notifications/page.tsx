'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    Divider,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Info as InfoIcon,
    CheckCircle as SuccessIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    MoreVert as MoreIcon,
    Delete as DeleteIcon,
    Link as LinkIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { notificationService, Notification } from '@/services/notification.service';

const notificationIcons = {
    info: <InfoIcon color="info" />,
    success: <SuccessIcon color="success" />,
    warning: <WarningIcon color="warning" />,
    error: <ErrorIcon color="error" />,
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [openDetails, setOpenDetails] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await notificationService.deleteNotification(id);
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleClearAll = async () => {
        if (window.confirm('Are you sure you want to clear all notifications?')) {
            try {
                await notificationService.clearAllNotifications();
                fetchNotifications();
            } catch (error) {
                console.error('Error clearing notifications:', error);
            }
        }
    };

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, notification: Notification) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedNotification(notification);
    };

    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
    };

    const handleViewDetails = (notification: Notification) => {
        setSelectedNotification(notification);
        setOpenDetails(true);
    };

    const handleNavigateToRelated = (notification: Notification) => {
        if (notification.relatedTo) {
            const { type, id } = notification.relatedTo;
            router.push(`/${type}s/${id}`);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
            });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        }
    };

    return (
        <DashboardLayout>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4">Notifications</Typography>
                    <Box>
                        <Button
                            variant="outlined"
                            onClick={handleMarkAllAsRead}
                            sx={{ mr: 1 }}
                        >
                            Mark All as Read
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleClearAll}
                        >
                            Clear All
                        </Button>
                    </Box>
                </Box>

                <Paper>
                    <List>
                        {notifications.map((notification, index) => (
                            <React.Fragment key={notification.id}>
                                {index > 0 && <Divider />}
                                <ListItem
                                    sx={{
                                        bgcolor: notification.isRead ? 'inherit' : 'action.hover',
                                    }}
                                >
                                    <ListItemIcon>{notificationIcons[notification.type]}</ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography
                                                    component="span"
                                                    variant="subtitle1"
                                                    sx={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}
                                                >
                                                    {notification.title}
                                                </Typography>
                                                {notification.relatedTo && (
                                                    <Chip
                                                        icon={<LinkIcon />}
                                                        label={`${notification.relatedTo.type}: ${notification.relatedTo.name}`}
                                                        size="small"
                                                        sx={{ ml: 1 }}
                                                        onClick={() => handleNavigateToRelated(notification)}
                                                    />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {notification.message}
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    sx={{ ml: 1 }}
                                                >
                                                    • {formatDate(notification.createdAt)}
                                                </Typography>
                                            </Typography>
                                        }
                                        onClick={() => handleViewDetails(notification)}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={(e) => handleOpenMenu(e, notification)}
                                        >
                                            <MoreIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </React.Fragment>
                        ))}
                        {notifications.length === 0 && (
                            <ListItem>
                                <ListItemText
                                    primary={
                                        <Typography align="center" color="text.secondary">
                                            No notifications
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        )}
                    </List>
                </Paper>

                {/* Notification Menu */}
                <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={handleCloseMenu}
                >
                    {selectedNotification && !selectedNotification.isRead && (
                        <MenuItem
                            onClick={() => {
                                handleMarkAsRead(selectedNotification.id);
                                handleCloseMenu();
                            }}
                        >
                            Mark as read
                        </MenuItem>
                    )}
                    <MenuItem
                        onClick={() => {
                            handleDelete(selectedNotification!.id);
                            handleCloseMenu();
                        }}
                    >
                        Delete
                    </MenuItem>
                    {selectedNotification?.relatedTo && (
                        <MenuItem
                            onClick={() => {
                                handleNavigateToRelated(selectedNotification);
                                handleCloseMenu();
                            }}
                        >
                            View related item
                        </MenuItem>
                    )}
                </Menu>

                {/* Notification Details Dialog */}
                <Dialog
                    open={openDetails}
                    onClose={() => setOpenDetails(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Notification Details</DialogTitle>
                    <DialogContent>
                        {selectedNotification && (
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    {notificationIcons[selectedNotification.type]}
                                    <Typography variant="h6" sx={{ ml: 1 }}>
                                        {selectedNotification.title}
                                    </Typography>
                                </Box>
                                <Typography paragraph>{selectedNotification.message}</Typography>
                                {selectedNotification.relatedTo && (
                                    <Chip
                                        icon={<LinkIcon />}
                                        label={`${selectedNotification.relatedTo.type}: ${selectedNotification.relatedTo.name}`}
                                        onClick={() => {
                                            handleNavigateToRelated(selectedNotification);
                                            setOpenDetails(false);
                                        }}
                                        sx={{ mt: 1 }}
                                    />
                                )}
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                    sx={{ mt: 2 }}
                                >
                                    Created at: {new Date(selectedNotification.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDetails(false)}>Close</Button>
                        {selectedNotification?.relatedTo && (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    handleNavigateToRelated(selectedNotification);
                                    setOpenDetails(false);
                                }}
                            >
                                View Related Item
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </Box>
        </DashboardLayout>
    );
} 