import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

const StackedBarChart = ({data, type}) => {
    return (
        <ResponsiveContainer width="100%" height="65%">
            <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="interval" tickLine={false} unit="d"/>
                <YAxis tickLine={false} {...(type === 'reviewTime' ? {unit: 'm'} : {})}/>
                <Tooltip />
                <Legend verticalAlign="top" align="center" height={36} />
                <Bar legendType="rect" dataKey="new" stackId="a" fill="#76b5c5" name="new"/>
                <Bar legendType="rect" dataKey="learning" stackId="a" fill="#063970" name="learning"/>
                <Bar legendType="rect" dataKey="relearning" stackId="a" fill="#eab676" name="relearning"/>
                <Bar legendType="rect" dataKey="young" stackId="a" fill="#E56343" name="young"/>
                <Bar legendType="rect" dataKey="mature" stackId="a" fill="#873e23" name="mature"/>
            </BarChart>
        </ResponsiveContainer>
    )
}

export default StackedBarChart;