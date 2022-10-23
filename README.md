# Use MinIO (S3-compatible storage server) as Deno Module Registry

Simple usage for uploading and importing TypeScript modules for Deno.

## Configure

Create `.env` file with the following content:

```env
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_BUCKET=
S3_URL=
```

`S3_URL` is the URL to MinIO server (e.g. http://localhost:9000)

## Usage

### Upload Module

This repository provides `add.mod.ts`, a simple module for testing purpose.

To upload the module, run the following script

```bash
deno --allow-read --allow-net --allow-env upload.ts add.mod.ts
```

If the output is `Status: 200`, then the file should be available in the MinIO server within the specified bucket `S3_BUCKET`.


### Import Module

**Note**: You must configure your bucket to accept the public access (download only) in order for this use-case to work.

See `import-mod.ts`.

```js
import { add } from "http://localhost:9000/hello/add.mod.ts";

console.log(add(3, 3));
```

Assuming that your `S3_BUCKET` is set to `hello`, and `S3_URL` is set to `http://localhost:9000`.
