using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using POS_APPLICATION.Models;
using RDL_TestProject.RS_Services.RS_Contract;
using RDL_TestProject.RS_Services.RS_Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION
{
    public class Startup
    {

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<MvcOptions>(options => {
               // options.Filters.Add(new RequireHttpsAttribute());
                options.Filters.Add(new RequireHttpsAttribute { Permanent = false });
            });
            var credentials = new EmailCredential();
            Configuration.GetSection("Credentials").Bind(credentials);
            services.AddSingleton(credentials);

            services.AddCors();
            services.AddScoped<IRS, RSC>();
            services.AddHttpContextAccessor();
            services.AddControllersWithViews();
            services.AddAntiforgery(o => o.HeaderName = "XSRF-TOKEN");
            services.AddControllersWithViews();
            services.AddRazorPages();
            services.AddMvc(options =>
            {
                //any other settings
            }).AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
            });

            services.AddCors(options =>
            {
                options.AddPolicy("GlobalWebPolicy",

                builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });
            services.AddSession(options =>
            {
                options.Cookie.Name = "Session";
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.IsEssential = true;
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            app.UseStaticFiles();
            app.UseRouting();
            app.UseSession();
            app.UseAuthorization();
            app.UseDeveloperExceptionPage();
            app.UseDefaultFiles();
            app.UseStaticFiles();
           // app.UseHttpsRedirection(false);

            app.UseEndpoints(endpoints =>
            {
                //endpoints.MapControllerRoute(
                //    name: "default",
                //    pattern: "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=User}/{action=Index}/{id?}");
                endpoints.MapControllerRoute(
                    name: "Onboarding",
                    pattern: "Onboarding/{controller=User}/{action=Onboarding}");
                endpoints.MapControllerRoute(
                    name: "Basic_information",
                    pattern: "Basic_information/{controller=User}/{action=Basic_information}");
                endpoints.MapControllerRoute(
                    name: "Illustration",
                    pattern: "Illustration/{controller=User}/{action=Illustration}");
                endpoints.MapControllerRoute(
                   name: "Policy_issuance",
                   pattern: "Policy_issuance/{controller=User}/{action=Policy_issuance}");
                endpoints.MapControllerRoute(
                   name: "Proposal_summary",
                   pattern: "Proposal_summary/{controller=User}/{action=Proposal_summary}");
                endpoints.MapControllerRoute(
                   name: "MyProfile",
                   pattern: "MyProfile/{controller=Services}/{action=MyProfile}");
                endpoints.MapControllerRoute(
                   name: "Funds",
                   pattern: "Funds/{controller=Services}/{action=Funds}");
                endpoints.MapControllerRoute(
                   name: "AlterContact",
                   pattern: "AlterContact/{controller=Services}/{action=AlterContact}");
                endpoints.MapControllerRoute(
                  name: "AlterEmail",
                  pattern: "AlterEmail/{controller=Services}/{action=AlterEmail}");
                endpoints.MapControllerRoute(
                  name: "CheckEmail",
                  pattern: "CheckEmail/{controller=Services}/{action=CheckEmail}");
                endpoints.MapControllerRoute(
                  name: "PartialWithdrawal",
                  pattern: "PartialWithdrawal/{controller=Services}/{action=PartialWithdrawal}");
                endpoints.MapControllerRoute(
                  name: "ClaimIntimation",
                  pattern: "ClaimIntimation/{controller=Services}/{action=ClaimIntimation}");
                endpoints.MapControllerRoute(
                  name: "Documents",
                  pattern: "Documents/{controller=Services}/{action=Documents}");
                endpoints.MapControllerRoute(
                  name: "FreeLook",
                  pattern: "FreeLook/{controller=Services}/{action=FreeLook}");
                endpoints.MapControllerRoute(
                  name: "PolicySurrender",
                  pattern: "PolicySurrender/{controller=Services}/{action=PolicySurrender}");
                endpoints.MapControllerRoute(
                  name: "ContributionPayment",
                  pattern: "ContributionPayment/{controller=Services}/{action=ContributionPayment}");
                endpoints.MapControllerRoute(
                  name: "CheckEmail",
                  pattern: "CheckEmail/{controller=Services}/{action=CheckEmail}");
                endpoints.MapControllerRoute(
                  name: "RecoverPassword",
                  pattern: "RecoverPassword/{controller=User}/{action=RecoverPassword}");
            });
        }
    }
}