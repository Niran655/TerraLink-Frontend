// import React, { useState } from 'react'
// import { IconButton, Drawer, Tooltip, List, ListItem, ListItemText, Stack, Typography, ListItemButton, Avatar } from '@mui/material'
// import { FaRegBell } from "react-icons/fa6";

// import "../Styles/notificationStyle.scss"
// export default function Notification() {

//     const [open, setOpen] = useState(false)

//     const toggleDrawer = (open) => (event) => {
//         if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
//             return
//         }
//         setOpen(open)
//     }
//     return (
//         <>
//             <Tooltip title="Notification" arrow>
//                 <IconButton onClick={() => setOpen(true)}>
//                     <FaRegBell className="link-icon" />
//                 </IconButton>
//             </Tooltip>
//             <Drawer
//                 anchor="right"
//                 open={open}
//                 onClose={toggleDrawer(false)}
//                 sx={{
//                     zIndex: (theme) => theme.zIndex.drawer + 1,
//                     '& .MuiDrawer-paper': {
//                         maxHeight: '80vh',
//                         height: 'auto',
//                         width: 500,
//                         position: 'absolute',
//                         top: '10%',
//                         right: '5%',
//                         transform: 'translate(-50%, -50%)',
//                         borderRadius: '10px',
//                     }
//                 }}

//             >
//                 <div role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
//                     <List className='notification-container'>
//                         <Stack paddingBottom="25px" direction="row" display="flex" justifyContent="space-between" alignItems="center">
//                             <Typography className='noti-title'>Your Notification</Typography>
//                             <Typography className='noti-mark-read'>Mark all as read</Typography>
//                         </Stack>
//                         {chatData?.map((row, index) => {
//                             return (
//                                 <ListItemButton
//                                     // className='noti-list-icon'
//                                     className={row?.isRead === true ? 'noti-unread' : "noti-read "}
//                                     component="a" href="#chat-list">
//                                     <Stack
//                                         direction="row"
//                                         display="flex"
//                                         width="100%"
//                                         justifyContent="center"
//                                         alignItems="center"
//                                         padding="0px 20px 5px 0px"
//                                     >
//                                         <Avatar sx={{ margin: "5px 10px 5px 0px" }} alt="Chanry" src={row?.image_profile} />
//                                         <Stack direction="row" display="flex" justifyContent="space-between" alignItems="center" width="100%" margin="5px">
//                                             <Stack>
//                                                 <Typography className="profile-text-title text-see-more">{row?.full_name}</Typography>
//                                                 <Typography className="profile-text-message text-see-more">
//                                                     {row?.last_message}
//                                                 </Typography>
//                                             </Stack>
//                                             <Stack className={row?.isRead === true ? 'noti-read-active' : "noti-read-no-active"}></Stack>
//                                         </Stack>
//                                     </Stack>
//                                 </ListItemButton>
//                             )
//                         })}
//                     </List>
//                 </div>
//             </Drawer>
//         </>

//     )
// }
// const chatData = [
//     {
//         id: 1,
//         full_name: "John Doe",
//         last_message: "I'm doing well, thanks! How about you?",
//         time_send: "2024-11-05 10:26:00",
//         message_count: 3,
//         image_profile: "https://randomuser.me/api/portraits/men/1.jpg",
//         isRead: true,
//     },
//     {
//         id: 2,
//         full_name: "Emily Davis",
//         last_message: "Sure, let me know a time that works for you.",
//         time_send: "2024-11-04 14:35:10",
//         message_count: 1,
//         image_profile: "https://randomuser.me/api/portraits/women/4.jpg",
//         isRead: true,
//     },
//     {
//         id: 3,
//         full_name: "Michael Johnson",
//         last_message: "On it! I'll send it by noon.",
//         time_send: "2024-11-03 08:25:00",
//         message_count: 7,
//         image_profile: "https://randomuser.me/api/portraits/men/3.jpg",
//         isRead: true,
//     },
//     {
//         id: 4,
//         full_name: "Alice Brown",
//         last_message: "Thanks! Got it.",
//         time_send: "2024-11-02 17:50:00",
//         message_count: 6,
//         image_profile: "https://randomuser.me/api/portraits/women/5.jpg",
//         isRead: false,
//     },
//     {
//         id: 5,
//         full_name: "Olivia Green",
//         last_message: "Sounds great! When are you free?",
//         time_send: "2024-11-01 09:20:00",
//         message_count: 4,
//         image_profile: "https://randomuser.me/api/portraits/women/6.jpg",
//         isRead: true,
//     }
// ];


import React from 'react'

const Notification = () => {
  return (
    <div>Notification</div>
  )
}

export default Notification