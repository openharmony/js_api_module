/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef JS_WORKER_MODULE_PLUGIN_TIMER_H_
#define JS_WORKER_MODULE_PLUGIN_TIMER_H_

#include <map>
#include <uv.h>

#include "../helper/napi_helper.h"
#include "../helper/object_helper.h"
#include "napi/native_api.h"
#include "napi/native_node_api.h"

namespace CompilerRuntime::WorkerModule::Plugin {
struct TimerCallbackInfo {
    napi_env env_;
    uint32_t tId_;
    uint32_t timeout_;
    napi_ref callback_;
    bool repeat_;
    uv_timer_t timeReq_;
    size_t argc_;
    napi_ref* argv_;

    TimerCallbackInfo(napi_env env, uint32_t tId, uint32_t timeout, napi_ref callback,
                     bool repeat, size_t argc, napi_ref* argv)
        : env_(env), tId_(tId), timeout_(timeout), callback_(callback),
          repeat_(repeat), argc_(argc), argv_(argv)
    {
        uv_loop_t* loop = Helper::NapiHelper::GetLibUV(env_);
        uv_timer_init(loop, &timeReq_);
    }

    ~TimerCallbackInfo();
};

class Timer {
public:
    Timer() = default;
    ~Timer() = default;
    static bool RegisterTime(napi_env env);
    static void ClearEnvironmentTimer(napi_env env);

private:
    static napi_value SetTimeout(napi_env env, napi_callback_info cbinfo);
    static napi_value SetInterval(napi_env env, napi_callback_info cbinfo);
    static napi_value ClearTimer(napi_env env, napi_callback_info cbinfo);
    static napi_value SetTimeoutInner(napi_env env, napi_callback_info cbinfo, bool repeat);
    static void TimerCallback(uv_timer_t* handle);

    static uint32_t timeCallbackId;
    static std::map<uint32_t, TimerCallbackInfo*> timerTable;
    static std::mutex timeLock;
};
} // namespace CompilerRuntime::WorkerModule::Plugin
#endif // JS_WORKER_MODULE_PLUGIN_TIMER_H_
