import React, { useState } from 'react';
import Calendar from 'react-calendar';


import 'react-calendar/dist/Calendar.css';
import '../assets/css/Citas.css';

const Citas = () => {

    const [date, setDate] = useState(new Date());
    return (
        <div>

            <p>Soy la pagina de inicio</p>
            <div className="calendar">
                <Calendar
                    onChange={setDate}
                    value={date}
                />
                {console.log(date)}
            </div>
        </div>
    );

}

export default Citas;

