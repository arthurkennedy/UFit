import myImage from "../assets/profile.jpg";

const template =()=>{
  function drawDefaultImage() {
    // Draw user initials
    /**
     * Logic to translate:
     * <html lang="en">
     *   <head>
     *     <script src="stack1.js"></script>
     *   </head>
     *   <body onload="draw();">
     *     <canvas id="canvas" width="180" height="180"></canvas>
     *   </body>
     * </html>
     *
     * function draw() {
     *   const canvas = document.getElementById('canvas');
     *   const ctx = canvas.getContext('2d');
     *   let img = new Image();
     *   img.addEventListener("load", ()=>{
     *     ctx.drawImage(img,0,0);
     *     ctx.font = '50px serif';
     *     ctx.fillText('Hello world', 50, 90);
     *   });
     *   img.src = "backdrop.png";
     * }
     * Valtoni Boaventura on StackOverflow
     * https://stackoverflow.com/questions/70324406/how-to-add-text-to-an-image-and-users-can-also-saved-the-image-with-the-added-te#:~:text=just%20draw%20the%20image%20when,the%20stuff%20drawn%20on%20canvas.
     */

    return(myImage)
  }
    return(
        <>
            <>
                <h1>Section One</h1>
                <>
                </>
            </>
            <>
                <h1>Section Two</h1>
                <>
                </>
            </>
            <>
                <h3>Section Three</h3>
                <>
                </>
            </>
        </>
    )
};
export default template;