#![no_std]

#[no_mangle]
pub static mut _fltused: i32 = 0x9875;

#[no_mangle]
pub static mut _tls_index: u32 = 0;

#[no_mangle]
pub unsafe extern "C" fn __chkstk() {}

#[no_mangle]
pub unsafe extern "C" fn atexit(_func: usize) -> i32 {
    0
}

#[export_name = "??_7type_info@@6B@"]
pub static TYPE_INFO_VTABLE: [usize; 2] = [0, 0];

#[no_mangle]
pub unsafe extern "C" fn mainCRTStartup() {
    extern "C" {
        fn main(argc: i32, argv: *const *const u8) -> i32;
        fn ExitProcess(code: u32) -> !;
    }
    let code = main(0, core::ptr::null());
    ExitProcess(code as u32);
}
