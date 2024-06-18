import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';

const SimplePieChart = ({data}) => {
    const COLORS = ['#76b5c5', '#063970', '#eab676', '#E56343', '#873e23'];

    return (
        <ResponsiveContainer width="100%" height="80%">
            <PieChart width={400} height={400}>
                <Pie
                    dataKey="num_cards"
                    isAnimationActive={true}
                    data={data}
                    cx="20%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    margin={{top: 0, right: 10, bottom: 0, left: 0}}
                >
                    {data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)}
                </Pie>
                <Legend payload={
                    data.map(
                        (item, index) => {
                            const sum = data.reduce((total, obj) => total + obj.num_cards, 0)
                            return {
                                id: item.name,
                                type: "circle",
                                value: ` ${item.name.padEnd(15, '-')} ${item.num_cards} (${Math.ceil(item.num_cards/sum*100)}%) `,
                                color: COLORS[index % COLORS.length]
                            }
                        }
                    )
                }
                        verticalAlign="middle" align="center" layout="vertical"  />
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    )
}

export default SimplePieChart;