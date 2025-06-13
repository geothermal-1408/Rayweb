function make_enviroment(...envs ){
    return new Proxy(envs,{
	get(target,prop,receiver){
	    for(let env of envs){
		if(env.hasOwnProperty(prop)){
		    return env[prop];
		}
	    }
	    return (...args) => {console.error("NOT IMPLEMENTED: "+prop,args)}
	}
    });
}

let previous = undefined;
let wasm = undefined;
let ctx = undefined;
let dt = undefined;

function cstrlen(mem,ptr){
    let len = 0;
    while(mem[ptr] != 0){
	len++;
	ptr++;
    }
    return len;
}
function cstr_to_jstr(buffer,ptr){
    const mem = new Uint8Array(buffer);
    const len = cstrlen(mem,ptr);
    const bytes = new Uint8Array(buffer,ptr,len);
    return new TextDecoder().decode(bytes);
}

function color_to_hex(r,g,b,a){
    r = r.toString(16).padStart(2,'0');
    g = g.toString(16).padStart(2,'0');
    b = b.toString(16).padStart(2,'0');
    a = a.toString(16).padStart(2,'0');

    return "#"+r+g+b+a;
}

function rgb_to_hex(color){
    const r = (color>>(0*8)&0xFF).toString(16).padStart(2,'0');
    const g = (color>>(1*8)&0xFF).toString(16).padStart(2,'0');
    const b = (color>>(2*8)&0xFF).toString(16).padStart(2,'0');
    const a = (color>>(3*8)&0xFF).toString(16).padStart(2,'0');
    
    return "#"+r+g+b+a;
}

WebAssembly.instantiateStreaming(fetch('game.wasm'),{
    env: make_enviroment({
	"InitWindow": (width,height,title_ptr) => {
	    ctx.canvas.width = width;
	    ctx.canvas.height = height;
	    const buffer = wasm.instance.exports.memory.buffer;
	    document.title = cstr_to_jstr(buffer,title_ptr);
	},
	"SetTargetFPS": (fps)=>{
	    console.log(`game is not currently in ${fps} FPS`);
	},
	"GetScreenWidth": ()=> {
	      return ctx.canvas.width;
	},
	"GetScreenHeight": ()=> {
	      return ctx.canvas.height;
	},
	"GetFrameTime": ()=>{
	    return dt;
	},
	"BeginDrawing": ()=>{
	},
	"EndDrawing": ()=>{
	},
	"DrawCircleV": (pos_ptr,radius,color_ptr)=>{
	    const buffer = wasm.instance.exports.memory.buffer;
	    const [posx,posy] = new Float32Array(buffer,pos_ptr,2);
	    const [r,g,b,a] = new Uint8Array(buffer,color_ptr,4);
	    
	    ctx.beginPath();
	    ctx.arc(posx,posy,radius,0,2*Math.PI);
	    ctx.fillStyle = color_to_hex(r,g,b,a);
	    ctx.fill();
	    
	},
	"ClearBackground": (color_ptr)=>{
	    const buffer = wasm.instance.exports.memory.buffer;
	    const [r,g,b,a] = new Uint8Array(buffer,color_ptr,4);
	    
	    ctx.fillStyle = color_to_hex(r,g,b,a);
	    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
	}
    })
}).then((w)=>{
    wasm = w;
    const canvas = document.getElementById("game");
    ctx = canvas.getContext("2d");
    
    w.instance.exports.game_init();
     function first(timestamp){
     	previous = timestamp;
     	window.requestAnimationFrame(next);
     }
    function next(timestamp){
     	dt = (timestamp - previous)/1000;
     	previous = timestamp;
	w.instance.exports.game_frame();
	window.requestAnimationFrame(next);
    }
    window.requestAnimationFrame(first);
});
