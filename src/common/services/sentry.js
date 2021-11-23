// 用来实施错误收集的服务
import * as Sentry from '@sentry/react-native';

const init = () =>{
	Sentry.init({dsn: 'https://feaf15c423d6463b906118155c4820d5@sentry.io/4427615',});
	Sentry.configureScope(function(scope) {
		scope.setLevel(Sentry.Severity.Error);
	})
}

export {Sentry, init}
