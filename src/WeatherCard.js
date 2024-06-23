import { Typography,Card } from "antd";

export const WeatherCard = (props)=>{
    const data = props.data;

    const getTitle = ()=>{
        return (
            <div>
                <div>
                    {data.title} ({data.type})
                </div>
            </div>
        )
    }

    const getContentBody = (params)=>{
        return (
            <Card.Grid
        >
          <div
          >
            <Typography
              style={{
                fontSize: "12px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontWeight: 500,
              }}
            >
              {params.label}{" "}
            </Typography>
            <Typography
              style={{
                fontSize: "16px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontWeight: 800,
                alignItems: "center",
                marginTop: 5,
              }}
            >
                {data[params.key]}
            </Typography>
          </div>
        </Card.Grid>
        )
    }

    const keys = [
        {
            label: "Temp",
            "key": "temp"
        },
        {
            label: "Temp max",
            "key": "temp_max"
        },{
            label: "Temp min",
            "key": "temp_min"
        },{
            label: "Humidity",
            "key": "humidity"
        },
        // {
        //     label: "Description",
        //     "key": "description"
        // }
    ]

    return (
      <Card title={getTitle()} style={{margin: 20}}>
        {keys.map((elem)=>{
            return getContentBody(elem)
        })}
      </Card>
    );
}