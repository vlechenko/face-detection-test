﻿using Microsoft.AspNetCore.Mvc;

namespace FaceApiWebTest.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Azure()
        {
            return View();
        }

        public IActionResult Google()
        {
            return View();
        }

        public IActionResult Amazon()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}