import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Um interceptor é como um "porteiro" que fica entre o seu código e o servidor.
// Toda requisição HTTP que sair da aplicação passa por ele primeiro.
// Aqui, ele verifica se existe um token JWT salvo e, se existir, o adiciona
// automaticamente ao cabeçalho de cada requisição — assim você não precisa
// lembrar de fazer isso manualmente em cada service.

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Se não há token (usuário não logado), a requisição segue sem modificação.
  // Isso é importante para as rotas públicas como /login e /registro.
  if (!token) {
    return next(req);
  }

  // "Clone" é necessário porque requisições HTTP são imutáveis no Angular.
  // Não podemos modificar a original — precisamos criar uma cópia com os headers novos.
  const reqAutenticada = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}` // padrão JWT: "Bearer <token>"
    }
  });

  return next(reqAutenticada);
};