import { Md5 } from "https://deno.land/std@0.160.0/hash/md5.ts";
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";
import {
  mime,
  Mime,
  MimeTypeMap,
} from "https://deno.land/x/mimetypes@v1.0.0/mod.ts";
import { posix } from "https://deno.land/std@0.160.0/path/mod.ts";
import { config } from "https://deno.land/std@0.160.0/dotenv/mod.ts";

// load .env file
const env = await config({ path: ".env" });

const secret = env.S3_SECRET_KEY;
const access = env.S3_ACCESS_KEY;
const bucket = env.S3_BUCKET;
const serverUrl = env.S3_URL;

const httpVerb = "PUT";

const customMimeTypeMap: MimeTypeMap = {
  "application/typescript": ["ts"],
  "application/wasm": ["wasm"],
};
const myMime = new Mime(customMimeTypeMap);

const filePath = Deno.args[0];
const fileContent = await Deno.readFile(filePath);
const md5sum = new Md5().update(fileContent).toString("base64");
const mimeType = myMime.getType(filePath) || mime.getType(filePath);

const date = new Date();
const formattedDate = date.toUTCString();

const resource = `/${bucket}/${posix.basename(filePath)}`;

const stringSign = `${httpVerb}\n${md5sum}\n${mimeType}\n${formattedDate}\n${resource}`;
const signature = hmac("sha1", secret!, stringSign, "utf8", "base64");

const headers: HeadersInit = {
  Date: formattedDate,
  "Content-Type": mimeType!,
  "Content-MD5": md5sum,
  Authorization: `AWS ${access}:${signature}`,
};

const url = `${serverUrl}${resource}`;
const init: RequestInit = {
  method: httpVerb,
  headers: headers,
  body: fileContent,
};

const res = await fetch(url, init);

console.log(`Status: ${res.status}`);
