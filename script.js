const textSpinner = document.getElementById('textSpinner');
const textResult = document.getElementById('textResult');
const compareTextBtn = document.getElementById('compareText');

compareTextBtn.addEventListener('click', async () => {
  const t1 = document.getElementById('text1').value;
  const t2 = document.getElementById('text2').value;
  if(!t1 || !t2){ textResult.innerText = "Enter both texts"; return; }

  textSpinner.style.display = "block";
  textResult.innerHTML = "";

  try {
    const res = await fetch('http://localhost:5000/api/compare/text',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({text1:t1,text2:t2})
    });
    const data = await res.json();
    textResult.innerHTML = data.winner
      ? `<span class="winner">${data.winner} wins!</span><br>Reason: ${data.reason}`
      : `No winner. Reason: ${data.reason}`;
  } catch(err){
    textResult.innerText = "Error contacting API";
  } finally {
    textSpinner.style.display = "none";
  }
});

const imageSpinner = document.getElementById('imageSpinner');
const imageResult = document.getElementById('imageResult');
const compareImageBtn = document.getElementById('compareImage');

compareImageBtn.addEventListener('click', async () => {
  const i1 = document.getElementById('image1').files[0];
  const i2 = document.getElementById('image2').files[0];
  if(!i1 || !i2){ imageResult.innerText = "Select both images"; return; }

  imageSpinner.style.display = "block";
  imageResult.innerHTML = "";

  const formData = new FormData();
  formData.append("images", i1);
  formData.append("images", i2);

  try {
    const res = await fetch('http://localhost:5000/api/compare/image',{
      method:'POST',
      body: formData
    });
    const data = await res.json();
    imageResult.innerHTML = data.winner
      ? `<span class="winner">${data.winner} wins!</span><br>Reason: ${data.reason}`
      : `No winner. Reason: ${data.reason}`;
  } catch(err){
    imageResult.innerText = "Error contacting API";
  } finally {
    imageSpinner.style.display = "none";
  }
});