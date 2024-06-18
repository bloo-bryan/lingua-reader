import styled from "styled-components";
import {Drawer, LibMainContainer, LibImport1, LibImport2, LibBookPreview} from "../components";
import {Paper} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {orange} from "@mui/material/colors";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

const Wrapper = styled.section`
  .layout {
    width: 100%;
    height: 100%;

    display: grid;
    grid:
    "drawer body" 1fr
    / auto 1fr;
    gap: 8px;
  }

  .drawer { grid-area: sidebar; }
  .body {
    grid-area: body; 
  }
  .filler {
    grid-area: sidebar;
    width: 350px;
  }
`;

const Library = () => {
    return (
        <>
            {/*<Drawer/>*/}
            <LibMainContainer/>
        </>
    )
}

export default Library;