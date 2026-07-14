import React, { Fragment } from "react";
import Image from "next/image";
import Button from "@/features/shared/ui/button";
import Link from "next/link";

function HazratImage() {
  return (
    <Fragment>
      <div className="flex  items-center justify-between gap-4 w-full max-w-[1296px]h-full max-h-144.75">
        <div className="flex flex-col gap-12 w-full max-w-133.25 h-full max-h-144.75">
          <h1 className="text-2xl font-bold text-gray-400">
            درباره موکب حضرت ابوالفضل العباس (ع)
          </h1>
          <p className="text-gray-600 max-w-161.5">
            موکب حضرت ابوالفضل العباس با همت مردم، به خدمت‌رسانی به زائران
            اربعین می‌پردازد. فعالیت اصلی آن در زمینه تغذیه زائران و ارائه خدمات
            آشپزی و توزیع غذا است.علاوه بر تغذیه، موکب به اسکان زائران در نجف و
            ارائه خدمات رفاهی نیز می‌پردازد. امکان رزرو آنلاین عمومی و اختصاصی
            برای خانواده‌ها و کاروان‌ها فراهم شده است.
          </p>
          <Link href="/about">
            <Button
              size="lg"
              color="white"
              radius="md"
              border="green"
              className="max-w-50 w-full font-bold"
            >
              بیشتر بدانید
            </Button>
          </Link>
        </div>
        <div>
          <Image
            src="/tenplus.png"
            alt="tenplus"
            width={533}
            height={579}
            className="h-auto w-auto"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      </div>
    </Fragment>
  );
}

export default HazratImage;
