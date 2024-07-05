![](https://www.evernote.com/shard/s21/sh/21328125-91ab-4680-b3e2-3746c5f147d5/rXyJWuSyO7r1EF9CFdgYfNBkYNoW2UhfLpdkQW-RrxMjJBU9lS0NHbuW0Q/deep/0/image.png)


Place the following code in the `wp-config.php`.

```
define( 'GEOLONIA_API_KEY', 'YOUR-API-KEY' );
define( 'GEOLONIA_GIS_DEFAULT_STYLE', 'geolonia/gsi' );
define( 'GEOLONIA_GIS_DEFAULT_ZOOM', 16 );
define( 'GEOLONIA_GIS_DEFAULT_LAT', 34.86707002642607 );
define( 'GEOLONIA_GIS_DEFAULT_LNG', 138.32283481501884 );
```


## 開発者向け

### テスト環境のセットアップ

- 初回のみ以下のコマンドを実行して依存関係のインストールと、テスト用の WordPress のセットアップを行ってください。
- `svn` と `php` のインストールが必要です

```bash
$ composer install
$ bash bin/install-wp-tests.sh wordpress_test root '' localhost latest
```

### テストの実行

テストを実行するためには、以下のコマンドを実行してください。

```bash
$ composer test
```
