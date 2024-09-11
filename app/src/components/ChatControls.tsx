import {useEffect, useState} from "react";


function ChatControlsComponent({user, onPost, onTyping}) {
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(0);

    const maxMessageLength = 500;


    useEffect(() => {
        return () => {
            clearTimeout(typing);
        }
    }, []);

    function handleSubmit(formEvent: HTMLFormElement) {
        formEvent.preventDefault();
        const form = new FormData(formEvent.currentTarget);
        formEvent.currentTarget.reset();
        onPost(form.get('message'));
        setInput('');

        onTyping(false);
    }

    function updateInput(x) {
        if(input.length >= 500 && x.length >= input.length)
            return;

        setInput(x.target.value)

        clearTimeout(typing);

        onTyping(true);

        setTyping(setTimeout(() => {
            onTyping(false);
        }, 1000));
    }

    return (
        <>
            <form id="chat-controls-box" className="inline-form" onSubmit={handleSubmit}>
                <div className="input-box">
                    <span>{maxMessageLength - input.length} chars left</span>
                    <input
                        onChange={updateInput}
                        value={input}
                        type="text"
                        id="message"
                        name="message"
                        className="input-input"
                        placeholder="message"
                        maxLength={maxMessageLength}
                    />
                </div>

                <button type="submit">
                    Post
                </button>
            </form>
        </>
    )
}

export default ChatControlsComponent;