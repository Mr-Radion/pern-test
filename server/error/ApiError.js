// Универсальная обработка ошибок по входным данным под разные статус коды, класс расширяющий стандартный Error

class ApiError extends Error {
  constructor(status, message) {
    super();
    // присваиваем свойствам то, что получаем параметрами
    this.status = status;
    this.message = message;
  }

  // статичная функция это функция, которую можно вызывать без создания объекта,
  // т.е обращаясь к классу напрямую вызывать ту или иную статичную функцию
  // 4.. ошибки это проблемы на клиенте при запросе
  static badRequest(message) {
    return new ApiError(404, message);
  }

  // 5.. ошибки это проблемы на сервере
  static internal(message) {
    return new ApiError(500, message);
  }

  // если доступа нету
  static forbidden(message) {
    return new ApiError(403, message);
  }
}

module.exports = ApiError;
