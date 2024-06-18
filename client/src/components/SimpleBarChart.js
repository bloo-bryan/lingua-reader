import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SimpleBarChart = ({data, type}) => {
    if(type === 'answerButton') {
        return (
            <ResponsiveContainer width="100%" height="70%">
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" tickLine={false}/>
                    <YAxis tickLine={false}/>
                    <Tooltip />
                    <Legend verticalAlign="top" align="center" height={36} />
                    <Bar radius={[10, 10, 0, 0]} dataKey="0" fill="#76b5c5" legendType="circle" name="grade 0"/>
                    <Bar radius={[10, 10, 0, 0]} dataKey="1" fill="#063970" legendType="circle" name="grade 1"/>
                    <Bar radius={[10, 10, 0, 0]} dataKey="2" fill="#eab676" legendType="circle" name="grade 2"/>
                    <Bar radius={[10, 10, 0, 0]} dataKey="3" fill="#E56343" legendType="circle" name="grade 3"/>
                    <Bar radius={[10, 10, 0, 0]} dataKey="4" fill="#873e23" legendType="circle" name="grade 4"/>
                    <Bar radius={[10, 10, 0, 0]} dataKey="5" fill="#21130d" legendType="circle" name="grade 5"/>
                </BarChart>
            </ResponsiveContainer>
        )
    } else if(type === 'intervals') {
        return (
            <ResponsiveContainer width="100%" height="70%">
                <BarChart
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
                    <YAxis tickLine={false}/>
                    <Tooltip />
                    <Legend verticalAlign="top" align="center" height={36}/>
                    <Bar radius={[10, 10, 0, 0]} dataKey="num_reviews" fill="#76b5c5" legendType="circle" name="review count" />
                </BarChart>
            </ResponsiveContainer>
        )
    } else if(type === 'hourlyBreakdown') {
        return (
            <ResponsiveContainer width="100%" height="80%">
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" tickLine={false} unit="h"/>
                    <YAxis domain={[0, 100]} tickLine={false} unit="%"/>
                    <Tooltip />
                    <Legend verticalAlign="top" align="center" height={36}/>
                    <Bar radius={[10, 10, 0, 0]} dataKey="percentage" fill="#76b5c5" legendType="circle" name="success rate"/>
                </BarChart>
            </ResponsiveContainer>
        )
    }

}

export default SimpleBarChart;