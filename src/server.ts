import { webApplication} from './app/web';

webApplication.listen(3000, (): void => {
     console.info("Server running on port 3000");
});