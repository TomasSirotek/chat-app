import {
  Avatar,
  Divider,
  Fab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import SendIcon from "@mui/icons-material/Send";
import Container from '@mui/material/Container';


const Chat = () => {
  return (
    <>
        <Container component="main" >
      <Grid
        container
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid item xs={12}>
          <Typography variant="h5" className="header-message">
            Chat
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        component={Paper}
        sx={{
          width: "100%",
          height: "80vh",
        }}
      >
        <Grid
          item
          xs={3}
          sx={{
            borderRight: "1px solid #e0e0e0",
            paddingTop: "16px", // Add padding as needed
          }}
        >
          <Grid container item>
            <List>
              <ListItem key="RemySharp">
                <ListItemIcon>
                  <Avatar
                    alt="Remy Sharp"
                    src="https://material-ui.com/static/images/avatar/1.jpg"
                  />
                </ListItemIcon>
                <ListItemText primary="John Wick" />
              </ListItem>
            </List>
            <Divider />
            <Grid item xs={12} style={{ padding: "10px" }}>
              <TextField
                id="outlined-basic-email"
                label="Search"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Divider />
            <List>
              <ListItem key="RemySharp">
                <ListItemIcon>
                  <Avatar
                    alt="Remy Sharp"
                    src="https://material-ui.com/static/images/avatar/1.jpg"
                  />
                </ListItemIcon>
                <ListItemText primary="Remy Sharp" />
                <ListItemText secondary="online" />
              </ListItem>
              <ListItem key="Alice">
                <ListItemIcon>
                  <Avatar
                    alt="Alice"
                    src="https://material-ui.com/static/images/avatar/3.jpg"
                  />
                </ListItemIcon>
                <ListItemText primary="Alice" />
              </ListItem>
              <ListItem key="CindyBaker">
                <ListItemIcon>
                  <Avatar
                    alt="Cindy Baker"
                    src="https://material-ui.com/static/images/avatar/2.jpg"
                  />
                </ListItemIcon>
                <ListItemText primary="Cindy Baker" />
              </ListItem>
            </List>
          </Grid>
        </Grid>
        <Grid
          item
          xs={9}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <List
            sx={{
              flex: 1, // Make the list take up remaining vertical space
              overflowY: "auto", // Allow the list to be scrollable
              paddingLeft: "16px",
            }}
          >
            <ListItem key="1">
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText primary="Hey man, What's up ?" />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText secondary="09:30" />
                </Grid>
              </Grid>
            </ListItem>
            <ListItem key="2">
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText primary="Hey, I am Good! What about you ?" />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText secondary="09:31" />
                </Grid>
              </Grid>
            </ListItem>
            <ListItem key="3">
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText primary="Cool. I am good, let's catch up!" />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText secondary="10:30" />
                </Grid>
              </Grid>
            </ListItem>
            <ListItem key="3">
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText primary="Cool. I am good, let's catch up!" />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText secondary="10:30" />
                </Grid>
              </Grid>
            </ListItem>
         
          </List>
          <Divider />
          <Grid container style={{ padding: "20px" }}>
            <Grid item xs={11}>
              <TextField
                id="outlined-basic-email"
                label="Type Something"
                fullWidth
              />
            </Grid>
            <Grid sx={{
                marginLeft: "10px",
            }}>
              <Fab color="primary" aria-label="add">
                <SendIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      </Container>
    </>
    
  );
};

export default Chat;
