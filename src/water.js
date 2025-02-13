import React, {useState,useEffect}from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button,Container,Row,Col,Navbar, Nav,NavDropdown} from 'react-bootstrap';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WaterPage=()=>{

    let Page = "Water"
    
    const yellow = 500
    const red = 300


    const raw_data = [
        {
            name: "shiman",
            endtime: 15,
            time: ["1000","200","300","700","900","200","1000"],
            color: ""
        },
        {
            name: "baoshan",
            endtime: 15,
            time: ["1000","700","900","200","200","300","400"],
            color: ""
        },
        {
            name: "yonhe",
            endtime: 15,
            time: ["200","300","100","200","200","300","100"],
            color: ""
        }
    ]

    const [area, setArea] = useState("竹科");
    const [data, setWaterinfo] = useState([]);
    const [rawdata, setrawdata] = useState([]);

    const handleDropdownSelect = (item) => {
        if(item==="north"){
            setArea("竹科");
        }
        else if(item==="center"){
            setArea("中科");
        }
        else{
            setArea("南科");
        }

        handleAPI(item)
    }

    const handleAPI = (area) => {
        // fetch("/api/get_water")
        // .then(res => res.json())

        let waterinfo = [];
        for(let i=0;i<raw_data[0].time.length;i++){ // 過去7小時
            let tmp={};
            let t = raw_data[0].endtime-raw_data[0].time.length+i+1;
            if(t<=0){
                t = t+24;
            }
            tmp["time"]=t.toString()+":00";
            for(let j=0;j<raw_data.length;j++){ // 所有水庫
                tmp[raw_data[j].name]=raw_data[j].time[i];

                if(i===raw_data[0].time.length-1){ // 水庫當前水量
                    if(raw_data[j].time[i]>yellow){
                        raw_data[j].color = "#0EC23F"; // 綠色 健康水位
                    }
                    if(raw_data[j].time[i]<=yellow){
                        raw_data[j].color = "#E4CC08"; // 黃色
                    }
                    if(raw_data[j].time[i]<=red){
                        raw_data[j].color = "#EA1B0C"; // 紅色 危險水位
                    }
                }
            }
            
            waterinfo.push(tmp);
            console.log({tmp});
        }
        
        console.log({waterinfo})
        setrawdata(raw_data)
        setWaterinfo(waterinfo)

    }

    useEffect(() => {
        handleAPI();
      }, []);

    return (
        <>
            <header>
            <Navbar bg="dark" variant='dark' expand="lg" style={{ height: '15vh'}}>
                <Container sm={4} >
                    <Navbar.Brand  href="/">Meteorological center</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="area" id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={ () =>handleDropdownSelect('north')}>
                            竹科
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleDropdownSelect('center')}>
                            中科
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleDropdownSelect('south')}>
                            南科
                        </NavDropdown.Item>
                        </NavDropdown>
                        
                        <NavDropdown title="Information" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/earthquake">
                            earthquake
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/electronic">
                            electronic
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/water">
                            water
                        </NavDropdown.Item>
                        </NavDropdown>
                        
                    </Nav>
                    </Navbar.Collapse>
                </Container>

                <Container sm={4} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Navbar.Brand style={{ fontSize: '40px' }}>
                        {Page}({area})
                    </Navbar.Brand>
                </Container>

                <Container sm={4} >

                </Container>
            </Navbar>
            </header>
            <main>
                <Container fluid style={{ backgroundColor: 'lightgreen', height: '85vh'}}>
                    <Row >
                        <Col sm={12} style={{ backgroundColor: 'azure'}}>
                        <div style={{ width: '100%' }}>
                            {rawdata.map((item) => (
                                <div>
                                    <div style={{height:"15px"} }></div>
                                    <h4 style={{ display: 'flex', alignItems: 'center' }}>
                                        {item.name}
                                        {item.color==="#EA1B0C" ? (
                                            <div style={{ color: 'red'}}>(warning!!!)</div>
                                        ) : null}
                                    </h4>
                                    
                                    <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart
                                        width={500}
                                        height={200}
                                        data={data}
                                        syncId="anyId"
                                        margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey={item.name} stroke={item.color} fill={item.color} />
                                    </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ))}
                            

                        </div>
                        </Col>
                    </Row>
                    
                </Container>
            </main>
        </>
      );
}

export default WaterPage;