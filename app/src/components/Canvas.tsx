import React, {useRef, useEffect, useState} from 'react'
import {useSelector} from "react-redux";

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var wordWidth = ctx.measureText(word).width;

        if(wordWidth > maxWidth) {

        }

        var width = ctx.measureText(currentLine + " " + word).width;

        if (width < maxWidth - 250) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

const Canvas = ({chat, status, ...props}) => {
    const canvasRef = useRef(null);
    const [xy, setXY] = useState({
        x: 0, x1: canvasWidth,
        y: 0, y1: canvasHeight,
        cx: canvasWidth / 2, cy: canvasHeight / 2
    });

    useEffect(() => {
        reset();

        document.addEventListener('mousedown', (x) => {
            console.log('mouseDown', x);
        })

        return () => {
            document.removeEventListener('mousedown', () => {
                console.log('huh');
            });
        }
    }, []);

    useEffect(() => {
        reset();

    }, [chat, status])

    function draw() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        ctx.save();

        const lineWidth = 10;
        ctx.fillStyle = '#000000'
        ctx.strokeStyle = 'green'
        ctx.lineWidth = lineWidth;

        ctx.restore();
        let _f = 25
        ctx.font = _f + 'px Arial'
        ctx.strokeStyle = 'green'

        if(chat && status.drawChats) {
            drawChats(ctx);
        }

    }

    function drawTextLines(ctx, lines, x, y, fontSize) {
        if(!lines.length) {
            return;
        }

        let line = lines.pop();
        ctx.strokeText(line, 0, y)

        return drawTextLines(ctx, lines, x, y - fontSize, fontSize);
    }

    function drawChats(ctx) {
        const fontSize = 25;
        let _c = chat.chats[chat.chats.length - 1];

        ctx.font = fontSize + 'px Arial';
        ctx.fillStyle = 'green';

        let lines = getLines(ctx, _c.message, window.innerWidth)
        // drawTextLines(ctx, lines, 50, window.innerHeight / 2, fontSize);

        let x = 15;
        let y = 100;

        for(let x = 0; x <= lines.length - 1; x++) {
            let line = lines[x];
            ctx.strokeText(line, 0, y)

            y += fontSize;
        }
    }

    function reset() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        setXY({
            x: 0, x1: canvas.width,
            y: 0, y1: canvas.height,
            cx: canvas.width / 2, cy: canvas.height / 2
        });

        draw();
    }

    console.log(chat)
    return <>
        <canvas style={{
            zIndex: '-1',
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            left: 0,
            top: 0,
        }} ref={canvasRef} {...props} />
    </>
}

export default Canvas