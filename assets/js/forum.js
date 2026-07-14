// Forum voting
document.addEventListener('click', e=>{ if(e.target.matches('.vote')){ e.target.textContent = '▲ '+(parseInt(e.target.dataset.v||0)+1); }});
