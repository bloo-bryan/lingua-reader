import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Reader, Error, Library, Vocabulary, Stats} from './pages';
import {Drawer, LibBookPreview, LibImport1, LibImport2} from './components';
import themeOptions from "./utils/theme";
import {createTheme,ThemeProvider} from "@mui/material/styles";
import {orange} from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import {Review} from "./pages";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

//import {Landing, Error, Register} from './pages';
//import {ToastContainer} from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import {AllJobs, Profile, SharedLayout, Stats, AddJob} from './pages/dashboard';
// import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  const theme = createTheme({
      palette: {
      }
  })
  return (
      <ThemeProvider theme={theme}>
          <CssBaseline/>
          <BrowserRouter>
              <Drawer/>
              <Routes>
                  <Route path='/' element={<Library />} />
                  <Route path='import1' element={<LibImport1/>}/>
                  <Route path='import2' element={<LibImport2/>}/>
                  <Route path='preview' element={<LibBookPreview/>}/>
                  <Route path='reader' element={<Reader />} />
                  <Route path='vocabulary' element={<Vocabulary />} />
                  <Route path='review' element={<Review />} />
                  <Route path='stats' element={<Stats />} />
                  <Route path='*' element={<Error />} />
              </Routes>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            {/*  <Drawer/>*/}
          </BrowserRouter>
      </ThemeProvider>
  );
}

export default App;