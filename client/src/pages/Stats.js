import {ChartsContainer} from "../components";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearValues, fetchStatistics} from "../features/statSlice";

const Stats = () => {
    const dispatch = useDispatch();
    const {duration} = useSelector((state) => state.stat)

    useEffect(() => {
        dispatch(clearValues());
    }, []);


    useEffect(() => {
        dispatch(fetchStatistics(duration));
    }, [duration]);

    return (
        <ChartsContainer/>
    )
}

export default Stats;