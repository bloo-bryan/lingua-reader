import ViewCarouselRoundedIcon from '@mui/icons-material/ViewCarouselRounded';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';


const links = [
    {
        id: 1,
        text: 'Library',
        path: '/',
        icon: <CollectionsBookmarkIcon />,
    },
    {
        id: 2,
        text: 'Reader',
        path: 'reader',
        icon: <AutoStoriesIcon />,
    },
    {
        id: 3,
        text: 'Vocabulary List',
        path: 'vocabulary',
        icon: <FormatListNumberedIcon />,
    },
    {
        id: 4,
        text: 'Flashcards',
        path: 'review',
        icon: <ViewCarouselRoundedIcon />,
    },
    {
        id: 5,
        text: 'Progress Tracker',
        path: 'stats',
        icon: <BarChartRoundedIcon />,
    },

];

export default links;