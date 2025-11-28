import fetchImpl, { Headers as FetchHeaders, Request as FetchRequest, Response as FetchResponse } from "node-fetch";
if (typeof (globalThis as any).fetch === "undefined") (globalThis as any).fetch = fetchImpl;
if (typeof (globalThis as any).Headers === "undefined") (globalThis as any).Headers = FetchHeaders as unknown as typeof Headers;
if (typeof (globalThis as any).Request === "undefined") (globalThis as any).Request = FetchRequest as unknown as typeof Request;
if (typeof (globalThis as any).Response === "undefined") (globalThis as any).Response = FetchResponse as unknown as typeof Response;