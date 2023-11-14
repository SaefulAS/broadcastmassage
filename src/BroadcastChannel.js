import React, { useState, useEffect } from 'react';

function PubSubComponent() {
    const [receivedMessage, setReceivedMessage] = useState('');
    const [messageToSend, setMessageToSend] = useState('');
    const [secondFormValue, setSecondFormValue] = useState('');
    const [channel, setChannel] = useState(null);

    useEffect(() => {
        const localChannel = new BroadcastChannel('my_channel');
        setChannel(localChannel);
    
        localChannel.onmessage = (event) => {
            switch (event.data.type) {
                case 'firstForm':
                    setReceivedMessage(event.data.value);
                    break;
                case 'secondForm':
                    setSecondFormValue(event.data.value);
                    break;
                default:
                    break;
            }
        };
    
        return () => {
            localChannel.close();
        };
    }, []);
    

    const handleSend = () => {
        if (channel) {
            channel.postMessage({ type: 'firstForm', value: messageToSend });
            setMessageToSend(''); 
        }
    };

    const handleSecondFormChange = (e) => {
        const value = e.target.value;
        setSecondFormValue(value);
        if (channel) {
            channel.postMessage({ type: 'secondForm', value });
        }
    }

    return (
        <div>
            {/* First Form */}
            <div>
                <input
                    value={messageToSend}
                    onChange={e => setMessageToSend(e.target.value)}
                />
                <button onClick={handleSend}>Send</button>
                <p>Received Message: {receivedMessage}</p>
            </div>

            {/* Second Form */}
            <div>
                <input
                    value={secondFormValue}
                    onChange={handleSecondFormChange}
                />
                <p>Value from other tab: {secondFormValue}</p>
            </div>
        </div>
    );
}

export default PubSubComponent;
