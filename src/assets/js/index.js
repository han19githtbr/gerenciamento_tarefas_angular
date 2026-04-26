setTimeout(function() {
  var mensagem = document.getElementById('welcome_message');
  var mensagemContainer = document.getElementById('mensagem_boas_vindas');

  if (!mensagem || !mensagemContainer) return;

  var text = "Olá! Bem vindo ao nosso sistema";
  var interval = 130;
  var index = 0;

  var timer = setInterval(function() {
    if (index < text.length) {
      mensagem.innerHTML += text[index];
      index++;
    } else {
      clearInterval(timer);
    }
  }, interval);

  mensagemContainer.style.left = '30px';
  setTimeout(function() {
    mensagemContainer.style.left = '-400px';
    setTimeout(function() {
      mensagemContainer.classList.add('hide');
    }, 1000);
  }, 7000);
}, 5000);
